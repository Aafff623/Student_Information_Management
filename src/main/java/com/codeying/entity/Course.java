package com.codeying.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import org.springframework.format.annotation.DateTimeFormat;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;
import java.util.List;

import java.io.Serializable;
/** 课程实体类 */
@TableName("tb_course")
public class Course implements Serializable {

  /** 课程主键 */
  @TableId private String id;

  /** 课程名称 */
  @TableField("name")
  private String name;

  /** 指导老师 */
  @TableField("teacherid")
  private String teacherid;

  /** 学分 */
  @TableField("score")
  private Double score;

  /** 课程简介 */
  @TableField("describtion")
  private String describtion;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getTeacherid() {
    return teacherid;
  }

  public void setTeacherid(String teacherid) {
    this.teacherid = teacherid;
  }

  public Double getScore() {
    return score;
  }

  public void setScore(Double score) {
    this.score = score;
  }

  public String getDescribtion() {
    return describtion;
  }

  public void setDescribtion(String describtion) {
    this.describtion = describtion;
  }
}

