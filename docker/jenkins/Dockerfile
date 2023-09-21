FROM jenkins/jenkins:2.423
USER root
COPY sources.list /etc/apt/sources.list
COPY --chown=jenkins:jenkins plugins.txt /usr/share/jenkins/ref/plugins.txt
USER jenkins
RUN jenkins-plugin-cli -f /usr/share/jenkins/ref/plugins.txt
