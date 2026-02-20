#!/bin/sh

# Determine APP_HOME
app_path="$0"
while [ -h "$app_path" ]; do
    APP_HOME=${app_path%"${app_path##*[!/]}"}
    app_path=$(ls -ld "$APP_HOME")
done
APP_HOME=$(cd "${APP_HOME}/.." && pwd)

# Find Java
if [ -n "$JAVA_HOME" ]; then
    JAVACMD="$JAVA_HOME/bin/java"
else
    JAVACMD="java"
fi

# Build classpath
CLASSPATH="$APP_HOME/gradle/wrapper/gradle-wrapper.jar"

# Execute Gradle
exec "$JAVACMD" -classpath "$CLASSPATH" org.gradle.wrapper.GradleWrapperMain "$@"
