cmake_minimum_required(VERSION 3.16)
project(algorithm)

set(CMAKE_CXX_STANDARD 11)
file(GLOB DBoW2_SRCS leetcode/15/main.cpp)
add_executable(${PROJECT_NAME} ${DBoW2_SRCS})