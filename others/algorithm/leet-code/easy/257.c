#include <stdio.h>
#include <malloc.h>

struct TreeNode {
    int val;
    struct TreeNode *left;
    struct TreeNode *right;
};

void dfs(struct TreeNode *root, char **paths, int *returnSize, int *sta, int top) {
    if (root == NULL) {
        return;
    }
    if (root->left == NULL && root->right == NULL) {
        char *tmp = (char *) malloc(1001);
        int len = 0;
        for (int i = 0; i < top; i++) {
            len += sprintf(tmp + len, "%d->", sta[i]);
        }
        sprintf(tmp + len, "%d", root->val);
        paths[(*returnSize)++] = tmp;
        return;
    }
    sta[top++] = root->val;
    dfs(root->left, paths, returnSize, sta, top);
    dfs(root->right, paths, returnSize, sta, top);
}

char **binaryTreePaths(struct TreeNode *root, int *returnSize) {
    char **paths = (char **) malloc(sizeof(char *) * 1001);
    *returnSize = 0;
    int sta[1001];
    dfs(root, paths, returnSize, sta, 0);
    return paths;
}

struct TreeNode *NewNode(int val);

void main(void) {
    struct TreeNode *root = NewNode(1);
    root->left = NewNode(2);
    root->right = NewNode(3);
    root->left->right = NewNode(5);
    int resultCount = 0;
    char **res = binaryTreePaths(root, &resultCount);
    printf("total: %d\n", resultCount);
    for (int i = 0; i < resultCount; i++) {
        printf("%d - %s\n", i, res[i]);
    }
    free(res);
    return;
}

struct TreeNode *NewNode(int val) {
    struct TreeNode *root = malloc(sizeof(struct TreeNode));
    root->left = NULL;
    root->right = NULL;
    root->val = val;
    return root;
}