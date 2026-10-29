@echo off
if exist "%~dp0..\maven\apache-maven-3.9.16\bin\mvn.cmd" (
    call "%~dp0..\maven\apache-maven-3.9.16\bin\mvn.cmd" %*
) else (
    call mvn %*
)
