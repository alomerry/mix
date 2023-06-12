[^bmap]:

    ```go
    const (
      // Maximum number of key/elem pairs a bucket can hold.
      bucketCntBits = 3
      bucketCnt     = 1 << bucketCntBits
    )
    // A bucket for a Go map.
    type bmap struct {
        // tophash generally contains the top byte of the hash value
        // for each key in this bucket. If tophash[0] < minTopHash,
        // tophash[0] is a bucket evacuation state instead.
        topbits  [bucketCnt]uint8
        // Followed by bucketCnt keys and then bucketCnt elems.
        // NOTE: packing all the keys together and then all the elems together makes the
        // code a bit more complicated than alternating key/elem/key/elem/... but it allows
        // us to eliminate padding which would be needed for, e.g., map[int64]int8.
        // Followed by an overflow pointer.
        keys     [bucketCnt]keytype
        values   [bucketCnt]valuetype
        pad      uintptr
        overflow uintptr
    }
    ```

[^mapextra]:

    ```go
    type mapextra struct {
      // If both key and elem do not contain pointers and are inline, then we mark bucket
      // type as containing no pointers. This avoids scanning such maps.
      // However, bmap.overflow is a pointer. In order to keep overflow buckets
      // alive, we store pointers to all overflow buckets in hmap.extra.overflow and hmap.extra.oldoverflow.
      // overflow and oldoverflow are only used if key and elem do not contain pointers.
      // overflow contains overflow buckets for hmap.buckets.
      // oldoverflow contains overflow buckets for hmap.oldbuckets.
      // The indirection allows to store a pointer to the slice in hiter.
      overflow    *[]*bmap
      oldoverflow *[]*bmap

      // nextOverflow holds a pointer to a free overflow bucket.
      nextOverflow *bmap
    }
    ```

[^hasGrowth]:

    ```go
    func hashGrow(t *maptype, h *hmap) {
      // If we've hit the load factor, get bigger.
      // Otherwise, there are too many overflow buckets,
      // so keep the same number of buckets and "grow" laterally.
      bigger := uint8(1)
      if !overLoadFactor(h.count+1, h.B) {
        bigger = 0
        h.flags |= sameSizeGrow
      }
      oldbuckets := h.buckets
      newbuckets, nextOverflow := makeBucketArray(t, h.B+bigger, nil)

      flags := h.flags &^ (iterator | oldIterator)
      if h.flags&iterator != 0 {
        flags |= oldIterator
      }
      // commit the grow (atomic wrt gc)
      h.B += bigger
      h.flags = flags
      h.oldbuckets = oldbuckets
      h.buckets = newbuckets
      h.nevacuate = 0
      h.noverflow = 0

      if h.extra != nil && h.extra.overflow != nil {
        // Promote current overflow buckets to the old generation.
        if h.extra.oldoverflow != nil {
          throw("oldoverflow is not nil")
        }
        h.extra.oldoverflow = h.extra.overflow
        h.extra.overflow = nil
      }
      if nextOverflow != nil {
        if h.extra == nil {
          h.extra = new(mapextra)
        }
        h.extra.nextOverflow = nextOverflow
      }

      // the actual copying of the hash table data is done incrementally
      // by growWork() and evacuate().
    }
    ```

[^walkAssignMapRead]:

    ```go
    // walkAssignMapRead walks an OAS2MAPR node.
    func walkAssignMapRead(init *ir.Nodes, n *ir.AssignListStmt) ir.Node {
      init.Append(ir.TakeInit(n)...)

      r := n.Rhs[0].(*ir.IndexExpr)
      walkExprListSafe(n.Lhs, init)
      r.X = walkExpr(r.X, init)
      r.Index = walkExpr(r.Index, init)
      t := r.X.Type()

      fast := mapfast(t)
      key := mapKeyArg(fast, r, r.Index, false)

      // from:
      //   a,b = m[i]
      // to:
      //   var,b = mapaccess2*(t, m, i)
      //   a = *var
      a := n.Lhs[0]

      var call *ir.CallExpr
      if w := t.Elem().Size(); w <= zeroValSize {
        fn := mapfn(mapaccess2[fast], t, false)
        call = mkcall1(fn, fn.Type().Results(), init, reflectdata.IndexMapRType(base.Pos, r), r.X, key)
      } else {
        fn := mapfn("mapaccess2_fat", t, true)
        z := reflectdata.ZeroAddr(w)
        call = mkcall1(fn, fn.Type().Results(), init, reflectdata.IndexMapRType(base.Pos, r), r.X, key, z)
      }

      // mapaccess2* returns a typed bool, but due to spec changes,
      // the boolean result of i.(T) is now untyped so we make it the
      // same type as the variable on the lhs.
      if ok := n.Lhs[1]; !ir.IsBlank(ok) && ok.Type().IsBoolean() {
        call.Type().Field(1).Type = ok.Type()
      }
      n.Rhs = []ir.Node{call}
      n.SetOp(ir.OAS2FUNC)

      // don't generate a = *var if a is _
      if ir.IsBlank(a) {
        return walkExpr(typecheck.Stmt(n), init)
      }

      var_ := typecheck.Temp(types.NewPtr(t.Elem()))
      var_.SetTypecheck(1)
      var_.MarkNonNil() // mapaccess always returns a non-nil pointer

      n.Lhs[0] = var_
      init.Append(walkExpr(n, init))

      as := ir.NewAssignStmt(base.Pos, a, ir.NewStarExpr(base.Pos, var_))
      return walkExpr(typecheck.Stmt(as), init)
    }
    ```

[^walkIndexMap]:

    ```go
    // walkIndexMap walks an OINDEXMAP node.
    // It replaces m[k] with *map{access1,assign}(maptype, m, &k)
    func walkIndexMap(n *ir.IndexExpr, init *ir.Nodes) ir.Node {
      n.X = walkExpr(n.X, init)
      n.Index = walkExpr(n.Index, init)
      map_ := n.X
      t := map_.Type()
      fast := mapfast(t)
      key := mapKeyArg(fast, n, n.Index, n.Assigned)
      args := []ir.Node{reflectdata.IndexMapRType(base.Pos, n), map_, key}

      var mapFn ir.Node
      switch {
      case n.Assigned:
        mapFn = mapfn(mapassign[fast], t, false)
      case t.Elem().Size() > zeroValSize:
        args = append(args, reflectdata.ZeroAddr(t.Elem().Size()))
        mapFn = mapfn("mapaccess1_fat", t, true)
      default:
        mapFn = mapfn(mapaccess1[fast], t, false)
      }
      call := mkcall1(mapFn, nil, init, args...)
      call.SetType(types.NewPtr(t.Elem()))
      call.MarkNonNil() // mapaccess1* and mapassign always return non-nil pointers.
      star := ir.NewStarExpr(base.Pos, call)
      star.SetType(t.Elem())
      star.SetTypecheck(1)
      return star
    }
    ```

[^walkExpr1-partly]:

    ```go
    func walkExpr1(n ir.Node, init *ir.Nodes) ir.Node {
      switch n.Op() {
      default:
        ir.Dump("walk", n)
        base.Fatalf("walkExpr: switch 1 unknown op %+v", n.Op())
        panic("unreachable")

      ...

      // a,b = m[i]
      case ir.OAS2MAPR:
        n := n.(*ir.AssignListStmt)
        return walkAssignMapRead(init, n)

      ...

      case ir.OINDEXMAP:
        n := n.(*ir.IndexExpr)
        return walkIndexMap(n, init)
      
      ...

      }

      // No return! Each case must return (or panic),
      // to avoid confusion about what gets returned
      // in the presence of type assertions.
    }
    ```

[^evacuated]:

    ```go
    const (
      // Possible tophash values. We reserve a few possibilities for special marks.
      // Each bucket (including its overflow buckets, if any) will have either all or none of its
      // entries in the evacuated* states (except during the evacuate() method, which only happens
      // during map writes and thus no one else can observe the map during that time).
      emptyRest      = 0 // this cell is empty, and there are no more non-empty cells at higher indexes or overflows.
      emptyOne       = 1 // this cell is empty
      evacuatedX     = 2 // key/elem is valid.  Entry has been evacuated to first half of larger table.
      evacuatedY     = 3 // same as above, but evacuated to second half of larger table.
      evacuatedEmpty = 4 // cell is empty, bucket is evacuated.
      minTopHash     = 5 // minimum tophash for a normal filled cell.
    )
    func evacuated(b *bmap) bool {
      // 迁移以桶位单位，所以获取第一个单元即可知道该桶是否迁移完成
      h := b.tophash[0]
      // 判断桶 tophash 第一位的值是否是 evacuatedX、evacuatedY、evacuatedEmpty 这三种状态是桶迁移完后设置的状态
      return h > emptyOne && h < minTopHash
    }
    ```

[^mapaccessK]:

    ```go
    func mapaccessK(t *maptype, h *hmap, key unsafe.Pointer) (unsafe.Pointer, unsafe.Pointer) {
      if h == nil || h.count == 0 {
        return nil, nil
      }
      hash := t.hasher(key, uintptr(h.hash0))
      m := bucketMask(h.B)
      b := (*bmap)(add(h.buckets, (hash&m)*uintptr(t.bucketsize)))
      if c := h.oldbuckets; c != nil {
        if !h.sameSizeGrow() {
          // There used to be half as many buckets; mask down one more power of two.
          m >>= 1
        }
        oldb := (*bmap)(add(c, (hash&m)*uintptr(t.bucketsize)))
        if !evacuated(oldb) {
          b = oldb
        }
      }
      top := tophash(hash)
    bucketloop:
      for ; b != nil; b = b.overflow(t) {
        for i := uintptr(0); i < bucketCnt; i++ {
          if b.tophash[i] != top {
            if b.tophash[i] == emptyRest {
              break bucketloop
            }
            continue
          }
          k := add(unsafe.Pointer(b), dataOffset+i*uintptr(t.keysize))
          if t.indirectkey() {
            k = *((*unsafe.Pointer)(k))
          }
          if t.key.equal(key, k) {
            e := add(unsafe.Pointer(b), dataOffset+bucketCnt*uintptr(t.keysize)+i*uintptr(t.elemsize))
            if t.indirectelem() {
              e = *((*unsafe.Pointer)(e))
            }
            return k, e
          }
        }
      }
      return nil, nil
    }
    ```

[^mapaccess1]:

    ```go
    // mapaccess1 returns a pointer to h[key].  Never returns nil, instead
    // it will return a reference to the zero object for the elem type if
    // the key is not in the map.
    // NOTE: The returned pointer may keep the whole map live, so don't
    // hold onto it for very long.
    func mapaccess1(t *maptype, h *hmap, key unsafe.Pointer) unsafe.Pointer {
      if raceenabled && h != nil {
        callerpc := getcallerpc()
        pc := abi.FuncPCABIInternal(mapaccess1)
        racereadpc(unsafe.Pointer(h), callerpc, pc)
        raceReadObjectPC(t.key, key, callerpc, pc)
      }
      if msanenabled && h != nil {
        msanread(key, t.key.size)
      }
      if asanenabled && h != nil {
        asanread(key, t.key.size)
      }
      if h == nil || h.count == 0 {
        if t.hashMightPanic() {
          t.hasher(key, 0) // see issue 23734
        }
        return unsafe.Pointer(&zeroVal[0])
      }
      if h.flags&hashWriting != 0 {
        fatal("concurrent map read and map write")
      }
      hash := t.hasher(key, uintptr(h.hash0))
      m := bucketMask(h.B)
      b := (*bmap)(add(h.buckets, (hash&m)*uintptr(t.bucketsize)))
      if c := h.oldbuckets; c != nil {
        if !h.sameSizeGrow() {
          // There used to be half as many buckets; mask down one more power of two.
          m >>= 1
        }
        oldb := (*bmap)(add(c, (hash&m)*uintptr(t.bucketsize)))
        if !evacuated(oldb) {
          b = oldb
        }
      }
      top := tophash(hash)
    bucketloop:
      for ; b != nil; b = b.overflow(t) {
        for i := uintptr(0); i < bucketCnt; i++ {
          if b.tophash[i] != top {
            if b.tophash[i] == emptyRest {
              break bucketloop
            }
            continue
          }
          k := add(unsafe.Pointer(b), dataOffset+i*uintptr(t.keysize))
          if t.indirectkey() {
            k = *((*unsafe.Pointer)(k))
          }
          if t.key.equal(key, k) {
            e := add(unsafe.Pointer(b), dataOffset+bucketCnt*uintptr(t.keysize)+i*uintptr(t.elemsize))
            if t.indirectelem() {
              e = *((*unsafe.Pointer)(e))
            }
            return e
          }
        }
      }
      return unsafe.Pointer(&zeroVal[0])
    }
    ```

[^mapdelete]:

    ```go
    func mapdelete(t *maptype, h *hmap, key unsafe.Pointer) {
      if h.flags&hashWriting != 0 {
        fatal("concurrent map writes")
      }
    
      hash := t.hasher(key, uintptr(h.hash0))
    
      // Set hashWriting after calling t.hasher, since t.hasher may panic,
      // in which case we have not actually done a write (delete).
      h.flags ^= hashWriting
    
      bucket := hash & bucketMask(h.B)
      if h.growing() {
        growWork(t, h, bucket)
      }
      b := (*bmap)(add(h.buckets, bucket*uintptr(t.bucketsize)))
      bOrig := b
      top := tophash(hash)
    search:
      for ; b != nil; b = b.overflow(t) {
        for i := uintptr(0); i < bucketCnt; i++ {
          if b.tophash[i] != top {
            if b.tophash[i] == emptyRest {
              break search
            }
            continue
          }
          k := add(unsafe.Pointer(b), dataOffset+i*uintptr(t.keysize))
          k2 := k
          if t.indirectkey() {
            k2 = *((*unsafe.Pointer)(k2))
          }
          if !t.key.equal(key, k2) {
            continue
          }
          // Only clear key if there are pointers in it.
          if t.indirectkey() {
            *(*unsafe.Pointer)(k) = nil
          } else if t.key.ptrdata != 0 {
            memclrHasPointers(k, t.key.size)
          }
          e := add(unsafe.Pointer(b), dataOffset+bucketCnt*uintptr(t.keysize)+i*uintptr(t.elemsize))
          if t.indirectelem() {
            *(*unsafe.Pointer)(e) = nil
          } else if t.elem.ptrdata != 0 {
            memclrHasPointers(e, t.elem.size)
          } else {
            memclrNoHeapPointers(e, t.elem.size)
          }
          b.tophash[i] = emptyOne
          // If the bucket now ends in a bunch of emptyOne states,
          // change those to emptyRest states.
          // It would be nice to make this a separate function, but
          // for loops are not currently inlineable.
          if i == bucketCnt-1 {
            if b.overflow(t) != nil && b.overflow(t).tophash[0] != emptyRest {
              goto notLast
            }
          } else {
            if b.tophash[i+1] != emptyRest {
              goto notLast
            }
          }
          for {
            b.tophash[i] = emptyRest
            if i == 0 {
              if b == bOrig {
                break // beginning of initial bucket, we're done.
              }
              // Find previous bucket, continue at its last entry.
              c := b
              for b = bOrig; b.overflow(t) != c; b = b.overflow(t) {
              }
              i = bucketCnt - 1
            } else {
              i--
            }
            if b.tophash[i] != emptyOne {
              break
            }
          }
        notLast:
          h.count--
          // Reset the hash seed to make it more difficult for attackers to
          // repeatedly trigger hash collisions. See issue 25237.
          if h.count == 0 {
            h.hash0 = fastrand()
          }
          break search
        }
      }
    
      if h.flags&hashWriting == 0 {
        fatal("concurrent map writes")
      }
      h.flags &^= hashWriting
    }
    
    // bucketMask returns 1<<b - 1, optimized for code generation.
    func bucketMask(b uint8) uintptr {
      return bucketShift(b) - 1
    }
    
    // noldbuckets calculates the number of buckets prior to the current map growth.
    func (h *hmap) noldbuckets() uintptr {
      oldB := h.B
      if !h.sameSizeGrow() {
        oldB--
      }
      return bucketShift(oldB)
    }
    
    // tophash calculates the tophash value for hash.
    func tophash(hash uintptr) uint8 {
      top := uint8(hash >> (goarch.PtrSize*8 - 8))
      if top < minTopHash {
        top += minTopHash
      }
      return top
    }
    
    func (b *bmap) overflow(t *maptype) *bmap {
      return *(**bmap)(add(unsafe.Pointer(b), uintptr(t.bucketsize)-goarch.PtrSize))
    }
    ```

[^mapassign]:

    ```go
    func mapassign(t *maptype, h *hmap, key unsafe.Pointer) unsafe.Pointer {
      if h == nil {
        panic(plainError("assignment to entry in nil map"))
      }
      if raceenabled {
        callerpc := getcallerpc()
        pc := abi.FuncPCABIInternal(mapassign)
        racewritepc(unsafe.Pointer(h), callerpc, pc)
        raceReadObjectPC(t.key, key, callerpc, pc)
      }
      if msanenabled {
        msanread(key, t.key.size)
      }
      if asanenabled {
        asanread(key, t.key.size)
      }
      if h.flags&hashWriting != 0 {
        fatal("concurrent map writes")
      }
      hash := t.hasher(key, uintptr(h.hash0))

      // Set hashWriting after calling t.hasher, since t.hasher may panic,
      // in which case we have not actually done a write.
      h.flags ^= hashWriting

      if h.buckets == nil {
        h.buckets = newobject(t.bucket) // newarray(t.bucket, 1)
      }

    again:
      bucket := hash & bucketMask(h.B)
      if h.growing() {
        growWork(t, h, bucket)
      }
      b := (*bmap)(add(h.buckets, bucket*uintptr(t.bucketsize)))
      top := tophash(hash)

      var inserti *uint8
      var insertk unsafe.Pointer
      var elem unsafe.Pointer
    bucketloop:
      for {
        for i := uintptr(0); i < bucketCnt; i++ {
          if b.tophash[i] != top {
            if isEmpty(b.tophash[i]) && inserti == nil {
              inserti = &b.tophash[i]
              insertk = add(unsafe.Pointer(b), dataOffset+i*uintptr(t.keysize))
              elem = add(unsafe.Pointer(b), dataOffset+bucketCnt*uintptr(t.keysize)+i*uintptr(t.elemsize))
            }
            if b.tophash[i] == emptyRest {
              break bucketloop
            }
            continue
          }
          k := add(unsafe.Pointer(b), dataOffset+i*uintptr(t.keysize))
          if t.indirectkey() {
            k = *((*unsafe.Pointer)(k))
          }
          if !t.key.equal(key, k) {
            continue
          }
          // already have a mapping for key. Update it.
          if t.needkeyupdate() {
            typedmemmove(t.key, k, key)
          }
          elem = add(unsafe.Pointer(b), dataOffset+bucketCnt*uintptr(t.keysize)+i*uintptr(t.elemsize))
          goto done
        }
        ovf := b.overflow(t)
        if ovf == nil {
          break
        }
        b = ovf
      }

      // Did not find mapping for key. Allocate new cell & add entry.

      // If we hit the max load factor or we have too many overflow buckets,
      // and we're not already in the middle of growing, start growing.
      if !h.growing() && (overLoadFactor(h.count+1, h.B) || tooManyOverflowBuckets(h.noverflow, h.B)) {
        hashGrow(t, h)
        goto again // Growing the table invalidates everything, so try again
      }

      if inserti == nil {
        // The current bucket and all the overflow buckets connected to it are full, allocate a new one.
        newb := h.newoverflow(t, b)
        inserti = &newb.tophash[0]
        insertk = add(unsafe.Pointer(newb), dataOffset)
        elem = add(insertk, bucketCnt*uintptr(t.keysize))
      }

      // store new key/elem at insert position
      if t.indirectkey() {
        kmem := newobject(t.key)
        *(*unsafe.Pointer)(insertk) = kmem
        insertk = kmem
      }
      if t.indirectelem() {
        vmem := newobject(t.elem)
        *(*unsafe.Pointer)(elem) = vmem
      }
      typedmemmove(t.key, insertk, key)
      *inserti = top
      h.count++

    done:
      if h.flags&hashWriting == 0 {
        fatal("concurrent map writes")
      }
      h.flags &^= hashWriting
      if t.indirectelem() {
        elem = *((*unsafe.Pointer)(elem))
      }
      return elem
    }
    ```

[^makeBucketArray]:

    ```go
    // makeBucketArray initializes a backing array for map buckets.
    // 1<<b is the minimum number of buckets to allocate.
    // dirtyalloc should either be nil or a bucket array previously
    // allocated by makeBucketArray with the same t and b parameters.
    // If dirtyalloc is nil a new backing array will be alloced and
    // otherwise dirtyalloc will be cleared and reused as backing array.
    func makeBucketArray(t *maptype, b uint8, dirtyalloc unsafe.Pointer) (buckets unsafe.Pointer, nextOverflow *bmap) {
      base := bucketShift(b)
      nbuckets := base
      // For small b, overflow buckets are unlikely.
      // Avoid the overhead of the calculation.
      if b >= 4 {
        // Add on the estimated number of overflow buckets
        // required to insert the median number of elements
        // used with this value of b.
        nbuckets += bucketShift(b - 4)
        sz := t.bucket.size * nbuckets
        up := roundupsize(sz)
        if up != sz {
          nbuckets = up / t.bucket.size
        }
      }

      if dirtyalloc == nil {
        buckets = newarray(t.bucket, int(nbuckets))
      } else {
        // dirtyalloc was previously generated by
        // the above newarray(t.bucket, int(nbuckets))
        // but may not be empty.
        buckets = dirtyalloc
        size := t.bucket.size * nbuckets
        if t.bucket.ptrdata != 0 {
          memclrHasPointers(buckets, size)
        } else {
          memclrNoHeapPointers(buckets, size)
        }
      }

      if base != nbuckets {
        // We preallocated some overflow buckets.
        // To keep the overhead of tracking these overflow buckets to a minimum,
        // we use the convention that if a preallocated overflow bucket's overflow
        // pointer is nil, then there are more available by bumping the pointer.
        // We need a safe non-nil pointer for the last overflow bucket; just use buckets.
        nextOverflow = (*bmap)(add(buckets, base*uintptr(t.bucketsize)))
        last := (*bmap)(add(buckets, (nbuckets-1)*uintptr(t.bucketsize)))
        last.setoverflow(t, (*bmap)(buckets))
      }
      return buckets, nextOverflow
    }
    ```

[^mapaccess2]:

    ```go
    func mapaccess2(t *maptype, h *hmap, key unsafe.Pointer) (unsafe.Pointer, bool) {
      if raceenabled && h != nil {
        callerpc := getcallerpc()
        pc := abi.FuncPCABIInternal(mapaccess2)
        racereadpc(unsafe.Pointer(h), callerpc, pc)
        raceReadObjectPC(t.key, key, callerpc, pc)
      }
      if msanenabled && h != nil {
        msanread(key, t.key.size)
      }
      if asanenabled && h != nil {
        asanread(key, t.key.size)
      }
      if h == nil || h.count == 0 {
        if t.hashMightPanic() {
          t.hasher(key, 0) // see issue 23734
        }
        return unsafe.Pointer(&zeroVal[0]), false
      }
      if h.flags&hashWriting != 0 {
        fatal("concurrent map read and map write")
      }
      hash := t.hasher(key, uintptr(h.hash0))
      m := bucketMask(h.B)
      b := (*bmap)(add(h.buckets, (hash&m)*uintptr(t.bucketsize)))
      if c := h.oldbuckets; c != nil {
        if !h.sameSizeGrow() {
          // There used to be half as many buckets; mask down one more power of two.
          m >>= 1
        }
        oldb := (*bmap)(add(c, (hash&m)*uintptr(t.bucketsize)))
        if !evacuated(oldb) {
          b = oldb
        }
      }
      top := tophash(hash)
    bucketloop:
      for ; b != nil; b = b.overflow(t) {
        for i := uintptr(0); i < bucketCnt; i++ {
          if b.tophash[i] != top {
            if b.tophash[i] == emptyRest {
              break bucketloop
            }
            continue
          }
          k := add(unsafe.Pointer(b), dataOffset+i*uintptr(t.keysize))
          if t.indirectkey() {
            k = *((*unsafe.Pointer)(k))
          }
          if t.key.equal(key, k) {
            e := add(unsafe.Pointer(b), dataOffset+bucketCnt*uintptr(t.keysize)+i*uintptr(t.elemsize))
            if t.indirectelem() {
              e = *((*unsafe.Pointer)(e))
            }
            return e, true
          }
        }
      }
      return unsafe.Pointer(&zeroVal[0]), false
    }
    ```

[^fastrand]:

    ```go
    //go:nosplit
    func fastrand() uint32 {
      mp := getg().m
      // Implement wyrand: https://github.com/wangyi-fudan/wyhash
      // Only the platform that math.Mul64 can be lowered
      // by the compiler should be in this list.
      if goarch.IsAmd64|goarch.IsArm64|goarch.IsPpc64|
        goarch.IsPpc64le|goarch.IsMips64|goarch.IsMips64le|
        goarch.IsS390x|goarch.IsRiscv64|goarch.IsLoong64 == 1 {
        mp.fastrand += 0xa0761d6478bd642f
        hi, lo := math.Mul64(mp.fastrand, mp.fastrand^0xe7037ed1a0b428db)
        return uint32(hi ^ lo)
      }

      // Implement xorshift64+: 2 32-bit xorshift sequences added together.
      // Shift triplet [17,7,16] was calculated as indicated in Marsaglia's
      // Xorshift paper: https://www.jstatsoft.org/article/view/v008i14/xorshift.pdf
      // This generator passes the SmallCrush suite, part of TestU01 framework:
      // http://simul.iro.umontreal.ca/testu01/tu01.html
      t := (*[2]uint32)(unsafe.Pointer(&mp.fastrand))
      s1, s0 := t[0], t[1]
      s1 ^= s1 << 17
      s1 = s1 ^ s0 ^ s1>>7 ^ s0>>16
      t[0], t[1] = s0, s1
      return s0 + s1
    }
    ```

[^bucketShift]:

    ```go
    // bucketShift returns 1<<b, optimized for code generation.
    func bucketShift(b uint8) uintptr {
      // Masking the shift amount allows overflow checks to be elided.
      return uintptr(1) << (b & (goarch.PtrSize*8 - 1))
    }
    ```

[^access-oas2mapr]:

    ::: code-tabs#before

    @tab before

    ```go
    a,b = m[i]
    ```

    @tab after

    ```go
    var,b = mapaccess2*(t, m, i)
    a = *var
    ```

    :::

[^access-oindex-map]:

    xxx

[^map-const]:

    ```go
    const (
      // Maximum number of key/elem pairs a bucket can hold.
      bucketCntBits = 3
      bucketCnt     = 1 << bucketCntBits

      // Maximum average load of a bucket that triggers growth is 6.5.
      // Represent as loadFactorNum/loadFactorDen, to allow integer math.
      loadFactorNum = 13
      loadFactorDen = 2

      // Maximum key or elem size to keep inline (instead of mallocing per element).
      // Must fit in a uint8.
      // Fast versions cannot handle big elems - the cutoff size for
      // fast versions in cmd/compile/internal/gc/walk.go must be at most this elem.
      maxKeySize  = 128
      maxElemSize = 128

      // data offset should be the size of the bmap struct, but needs to be
      // aligned correctly. For amd64p32 this means 64-bit alignment
      // even though pointers are 32 bit.
      dataOffset = unsafe.Offsetof(struct {
        b bmap
        v int64
      }{}.v)

      // Possible tophash values. We reserve a few possibilities for special marks.
      // Each bucket (including its overflow buckets, if any) will have either all or none of its
      // entries in the evacuated* states (except during the evacuate() method, which only happens
      // during map writes and thus no one else can observe the map during that time).
      emptyRest      = 0 // this cell is empty, and there are no more non-empty cells at higher indexes or overflows.
      emptyOne       = 1 // this cell is empty
      evacuatedX     = 2 // key/elem is valid.  Entry has been evacuated to first half of larger table.
      evacuatedY     = 3 // same as above, but evacuated to second half of larger table.
      evacuatedEmpty = 4 // cell is empty, bucket is evacuated.
      minTopHash     = 5 // minimum tophash for a normal filled cell.

      // flags
      iterator     = 1 // there may be an iterator using buckets
      oldIterator  = 2 // there may be an iterator using oldbuckets
      hashWriting  = 4 // a goroutine is writing to the map
      sameSizeGrow = 8 // the current map growth is to a new map of the same size

      // sentinel bucket ID for iterator checks
      noCheck = 1<<(8*goarch.PtrSize) - 1
    )
    ```

[^hmap]:

    ```go
    // A header for a Go map.
    type hmap struct {
      count     int // # live cells == size of map.  Must be first (used by len() builtin)
      flags     uint8
      B         uint8  // log_2 of # of buckets (can hold up to loadFactor * 2^B items)
      noverflow uint16 // approximate number of overflow buckets; see incrnoverflow for details
      hash0     uint32 // hash seed

      buckets    unsafe.Pointer // array of 2^B Buckets. may be nil if count==0.
      oldbuckets unsafe.Pointer // previous bucket array of half the size, non-nil only when growing
      nevacuate  uintptr        // progress counter for evacuation (buckets less than this have been evacuated)

      extra *mapextra // optional fields
    }
    // mapextra holds fields that are not present on all maps.
    type mapextra struct {
      overflow    *[]*bmap
      oldoverflow *[]*bmap

      nextOverflow *bmap
    }
    // A bucket for a Go map.
    type bmap struct {
      // tophash generally contains the top byte of the hash value
      // for each key in this bucket. If tophash[0] < minTopHash,
      // tophash[0] is a bucket evacuation state instead.
      tophash [bucketCnt]uint8
      // Followed by bucketCnt keys and then bucketCnt elems.
      // NOTE: packing all the keys together and then all the elems together makes the
      // code a bit more complicated than alternating key/elem/key/elem/... but it allows
      // us to eliminate padding which would be needed for, e.g., map[int64]int8.
      // Followed by an overflow pointer.
    }
    ```

[^maplit]:

    ```go
    func maplit(n *Node, m *Node, init *Nodes) {
      a := nod(OMAKE, nil, nil)
      a.Esc = n.Esc
      a.List.Set2(typenod(n.Type), nodintconst(int64(n.List.Len())))
      litas(m, a, init)

      entries := n.List.Slice()
      if len(entries) > 25 {
        ...
        return
      }

      // Build list of var[c] = expr.
      // Use temporaries so that mapassign1 can have addressable key, elem.
      ...
    }
    ```

[^makemap]: 

    ```go
    // makemap implements Go map creation for make(map[k]v, hint).
    // If the compiler has determined that the map or the first bucket
    // can be created on the stack, h and/or bucket may be non-nil.
    // If h != nil, the map can be created directly in h.
    // If h.buckets != nil, bucket pointed to can be used as the first bucket.
    func makemap(t *maptype, hint int, h *hmap) *hmap {
      mem, overflow := math.MulUintptr(uintptr(hint), t.bucket.size)
      if overflow || mem > maxAlloc {
        hint = 0
      }

      // initialize Hmap
      if h == nil {
        h = new(hmap)
      }
      h.hash0 = fastrand()

      // Find the size parameter B which will hold the requested # of elements.
      // For hint < 0 overLoadFactor returns false since hint < bucketCnt.
      B := uint8(0)
      for overLoadFactor(hint, B) {
        B++
      }
      h.B = B

      // allocate initial hash table
      // if B == 0, the buckets field is allocated lazily later (in mapassign)
      // If hint is large zeroing this memory could take a while.
      if h.B != 0 {
        var nextOverflow *bmap
        h.buckets, nextOverflow = makeBucketArray(t, h.B, nil)
        if nextOverflow != nil {
          h.extra = new(mapextra)
          h.extra.nextOverflow = nextOverflow
        }
      }

      return h
    }
    ```
[^init-map]: 

    ```go
    // 源码定义
    hash := map[string]int{
      "1": 2,
      "3": 4,
      "5": 6,
    }
    ```

[^init-map-within-25]: 

    ```go
    // 元素未超过 25 时转换成以下形式
    hash := make(map[string]int, 3)
    hash["1"] = 2
    hash["3"] = 4
    hash["5"] = 6
    ```

[^init-map-outof-25]: 

    ```go
    hash := make(map[string]int, 26)
    vstatk := []string{"1", "2", "3", ... ， "26"}
    vstatv := []int{1, 2, 3, ... , 26}
    for i := 0; i < len(vstak); i++ {
        hash[vstatk[i]] = vstatv[i]
    }
    ```

    ::: tip
    vstatk 和 vstatv 会被编辑器继续展开
    :::

[^makeBucketArray]: 

    ```go
    // makeBucketArray initializes a backing array for map buckets.
    // 1<<b is the minimum number of buckets to allocate.
    // dirtyalloc should either be nil or a bucket array previously
    // allocated by makeBucketArray with the same t and b parameters.
    // If dirtyalloc is nil a new backing array will be alloced and
    // otherwise dirtyalloc will be cleared and reused as backing array.
    func makeBucketArray(t *maptype, b uint8, dirtyalloc unsafe.Pointer) (buckets unsafe.Pointer, nextOverflow *bmap) {
      base := bucketShift(b)
      nbuckets := base
      // For small b, overflow buckets are unlikely.
      // Avoid the overhead of the calculation.
      if b >= 4 {
        // Add on the estimated number of overflow buckets
        // required to insert the median number of elements
        // used with this value of b.
        nbuckets += bucketShift(b - 4)
        sz := t.bucket.size * nbuckets
        up := roundupsize(sz)
        if up != sz {
          nbuckets = up / t.bucket.size
        }
      }
    
      if dirtyalloc == nil {
        buckets = newarray(t.bucket, int(nbuckets))
      } else {
        // dirtyalloc was previously generated by
        // the above newarray(t.bucket, int(nbuckets))
        // but may not be empty.
        buckets = dirtyalloc
        size := t.bucket.size * nbuckets
        if t.bucket.ptrdata != 0 {
          memclrHasPointers(buckets, size)
        } else {
          memclrNoHeapPointers(buckets, size)
        }
      }
    
      if base != nbuckets {
        // We preallocated some overflow buckets.
        // To keep the overhead of tracking these overflow buckets to a minimum,
        // we use the convention that if a preallocated overflow bucket's overflow
        // pointer is nil, then there are more available by bumping the pointer.
        // We need a safe non-nil pointer for the last overflow bucket; just use buckets.
        nextOverflow = (*bmap)(add(buckets, base*uintptr(t.bucketsize)))
        last := (*bmap)(add(buckets, (nbuckets-1)*uintptr(t.bucketsize)))
        last.setoverflow(t, (*bmap)(buckets))
      }
      return buckets, nextOverflow
    }
    ```

[^overLoadFactor]:

    ```go
    // overLoadFactor reports whether count items placed in 1<<B buckets is over loadFactor.
    func overLoadFactor(count int, B uint8) bool {
      return count > bucketCnt && uintptr(count) > loadFactorNum*(bucketShift(B)/loadFactorDen)
    }
    ```