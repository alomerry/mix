apt-get install redis-tools
redis-cli --cluster create 10.244.2.7:6379 10.244.4.6:6379 10.244.3.8:6379 10.244.1.7:6379 10.244.3.9:6379 10.244.4.7:6379 --cluster-replicas 1 -a 秘钥

```shell
k exec -n alomerry -it redis6-alomerry-0 bash
kubectl exec [POD] [COMMAND] is DEPRECATED and will be removed in a future version. Use kubectl exec [POD] -- [COMMAND] instead.
root@redis6-alomerry-0:/data# redis-cli --cluster create 10.244.2.7:6379 10.244.4.6:6379 10.244.3.8:6379 10.244.1.7:6379 10.244.3.9:6379 10.244.4.7:6379 --cluster-replicas 1 -a "z+~=dc:WQ+g2fHXkGZR>"
Warning: Using a password with '-a' or '-u' option on the command line interface may not be safe.
>>> Performing hash slots allocation on 6 nodes...
Master[0] -> Slots 0 - 5460
Master[1] -> Slots 5461 - 10922
Master[2] -> Slots 10923 - 16383
Adding replica 10.244.3.9:6379 to 10.244.2.7:6379
Adding replica 10.244.4.7:6379 to 10.244.4.6:6379
Adding replica 10.244.1.7:6379 to 10.244.3.8:6379
M: 235333d77c1d178e2b4581a69e169279eca0972e 10.244.2.7:6379
   slots:[0-5460] (5461 slots) master
M: 58051739e2cd2f06bfd4b3b00706b35b0eace508 10.244.4.6:6379
   slots:[5461-10922] (5462 slots) master
M: e9d1f610c5e038a61501ce2df0cafb0b41093095 10.244.3.8:6379
   slots:[10923-16383] (5461 slots) master
S: b545f2097b5fc5e66f6ccbe0c20c95a14547561d 10.244.1.7:6379
   replicates e9d1f610c5e038a61501ce2df0cafb0b41093095
S: 7b1ea4456b92e914743b80260b6ff59d5492fb77 10.244.3.9:6379
   replicates 235333d77c1d178e2b4581a69e169279eca0972e
S: bf0b45bf0e0672308350e49e9ccc433d0ea13ad7 10.244.4.7:6379
   replicates 58051739e2cd2f06bfd4b3b00706b35b0eace508
Can I set the above configuration? (type 'yes' to accept): yes
>>> Nodes configuration updated
>>> Assign a different config epoch to each node
>>> Sending CLUSTER MEET messages to join the cluster
Waiting for the cluster to join
.
>>> Performing Cluster Check (using node 10.244.2.7:6379)
M: 235333d77c1d178e2b4581a69e169279eca0972e 10.244.2.7:6379
   slots:[0-5460] (5461 slots) master
   1 additional replica(s)
M: 58051739e2cd2f06bfd4b3b00706b35b0eace508 10.244.4.6:6379
   slots:[5461-10922] (5462 slots) master
   1 additional replica(s)
M: e9d1f610c5e038a61501ce2df0cafb0b41093095 10.244.3.8:6379
   slots:[10923-16383] (5461 slots) master
   1 additional replica(s)
S: b545f2097b5fc5e66f6ccbe0c20c95a14547561d 10.244.1.7:6379
   slots: (0 slots) slave
   replicates e9d1f610c5e038a61501ce2df0cafb0b41093095
S: bf0b45bf0e0672308350e49e9ccc433d0ea13ad7 10.244.4.7:6379
   slots: (0 slots) slave
   replicates 58051739e2cd2f06bfd4b3b00706b35b0eace508
S: 7b1ea4456b92e914743b80260b6ff59d5492fb77 10.244.3.9:6379
   slots: (0 slots) slave
   replicates 235333d77c1d178e2b4581a69e169279eca0972e
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
```
