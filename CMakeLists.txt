cmake_minimum_required(VERSION 3.16)
project(algorithm)

set(CMAKE_CXX_STANDARD 11)
add_executable(${PROJECT_NAME} ${DBoW2_SRCS} leet-code/1-20/9/main.cpp)