[^makechan.switch]:

    ```go:no-line-numbers {1,2,3}
    func makechan(t *chantype, size int) *hchan {
      ...
      var c *hchan
      switch {
        case mem == 0:
        // Queue or element size is zero.
        c = (*hchan)(mallocgc(hchanSize, nil, true))
        // Race detector uses this location for synchronization.
        c.buf = c.raceaddr()
        case elem.ptrdata == 0:
        // Elements do not contain pointers.
        // Allocate hchan and buf in one call.
        c = (*hchan)(mallocgc(hchanSize+mem, nil, true))
        c.buf = add(unsafe.Pointer(c), hchanSize)
        default:
        // Elements contain pointers.
        c = new(hchan)
        c.buf = mallocgc(mem, elem, true)
      }
      ...
      return c
    }
    ```

[^waitq]:

    ```go:no-line-numbers 
    type waitq struct {
      first *sudog
      last  *sudog
    }
    ```