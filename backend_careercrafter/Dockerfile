# Builder stage
FROM maven:3.9-eclipse-temurin-21-alpine AS builder

WORKDIR /build

COPY pom.xml .
RUN mvn -q -B dependency:go-offline

COPY src ./src
RUN mvn -q -B -DskipTests clean package

# Runtime stage (JRE instead of JDK)
FROM bellsoft/liberica-runtime-container:jre-21-slim-glibc

WORKDIR /app

COPY --from=builder /build/target/*.jar /app/app.jar

EXPOSE 8084

RUN chown -R 1000:1000 /app
USER 1000:1000

ENTRYPOINT ["java","-XX:+UseContainerSupport","-XX:MaxRAMPercentage=75","-jar","/app/app.jar"]
