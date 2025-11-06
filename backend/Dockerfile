# --- Build Stage ---
# Use an official Maven image to build the application JAR
FROM maven:3.8.5-openjdk-17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven project file and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the rest of the source code
COPY src ./src

# Build the application, skipping tests for a faster build
RUN mvn clean package -DskipTests


# --- Run Stage ---
# Use a lightweight JRE image for the final container
FROM openjdk:17-jre-slim

# Set the working directory
WORKDIR /app

# Copy the built JAR file from the 'build' stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port the application runs on
EXPOSE 8080

# The command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]