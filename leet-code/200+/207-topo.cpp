class Solution
{
public:
    bool canFinish(int numCourses, vector<vector<int> > &prerequisites)
    {
        int ind[numCourses] = {0}, i, u, l, item;
        vector<int> gra[numCourses];
        l = prerequisites.size();
        for (i = 0; i < l; i++)
        {
            gra[prerequisites[i][0]].push_back(prerequisites[i][1]);
            ++ind[prerequisites[i][1]];
        }
        queue<int> q;
        for (i = 0; i < numCourses; i++)
            if (ind[i] == 0)
                q.push(i);
        while (!q.empty())
        {
            u = q.front();
            q.pop();
            l = gra[u].size();
            for (i = 0; i < gra[u].size(); i++)
            {
                item = gra[u][i];
                --ind[item];
                if (ind[item] == 0)
                    q.push(item);
            }
            --numCourses;
        }
        return numCourses == 0;
    }
};