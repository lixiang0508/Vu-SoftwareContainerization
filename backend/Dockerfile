FROM golang:1.21 as build
WORKDIR /app
COPY . .
RUN go build -o vegan cmd/main.go

FROM debian:latest
WORKDIR /app
COPY --from=build /app/vegan .
CMD [ "./vegan" ]
