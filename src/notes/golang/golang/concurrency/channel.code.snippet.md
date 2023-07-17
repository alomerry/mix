[^waitq]:

    ```go:no-line-numbers 
    type waitq struct {
      first *sudog
      last  *sudog
    }
    ```