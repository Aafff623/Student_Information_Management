package com.codeying;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 启动类
 */
@SpringBootApplication
@MapperScan("com.codeying.mapper")
公共 class App {

    //文件上传路径
    public static String fileUploadPath = System.getProperty("user.dir") + "\\fileUpload\\";

    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
    void contextLoads(){
        System.out.println("hello world-aaa");
    }
    void contextLoads_isPUll(){
        System.out.println("hello world-bbb");
    }
    
}
