#!/bin/sh

#
# Copyright © 2015-2024 the original author or authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

# Issue "Failed to load native library for platform" on Android 6.0 when building with JDK 1.9+
# https://issuetracker.google.com/issues/209371
# Add "-Xcompiler-option --core-library" to avoid compile errors with JDK 1.9+

# Add "-Xlint:deprecation" to suppress deprecation warnings

# Resolve the error "(some gradle process running)" in Ubuntu
# https://stackoverflow.com/a/37706786
org.gradle.daemon=true
org.gradle.parallel=true
org.gradle.jvmargs=-Xmx1536m

# Suppress "The project 'MyProject' may be using a version of Gradle that does not support the Java version used" error
# Use Java 17 for all Gradle tasks
org.gradle.java.home=$JAVA_HOME
