#!/bin/sh

# Determine the base directory
BASEDIR=$(dirname "$0")
cd "$BASEDIR" || exit 1

# Find Java
if [ -n "$JAVA_HOME" ]; then
    JAVACMD="$JAVA_HOME/bin/java"
else
    JAVACMD="java"
fi

# Build classpath
CLASSPATH="gradle/wrapper/gradle-wrapper.jar"

# Execute Gradle
exec "$JAVACMD" -classpath "$CLASSPATH" org.gradle.wrapper.GradleWrapperMain "$@"
