@echo off

wget -qO- --no-proxy "http://gfdev:18080/jenkins/job/github_moglabo_build/build?delay=5sec&token=moglabotoken&cause=moglabogitcommit" > NUL

