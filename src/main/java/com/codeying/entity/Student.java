package com.codeying.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import org.springframework.format.annotation.DateTimeFormat;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;
import java.util.List;

import java.io.Serializable;
/** 学生实体类 */
@TableName("tb_student")
public class Student extends LoginUser implements Serializable {

  public Student() {
    role = "student";
    rolech = "学生";
    isWuser = false;
  }

  /** 学生主键 */
  @TableId private String id;

  /** 用户名 */
  @TableField("username")
  private String username;

  /** 密码 */
  @TableField("password")
  private String password;

  /** 姓名 */
  @TableField("name")
  private String name;

  /** 头像 */
  @TableField("avatar")
  private String avatar;

  /** 性别 */
  @TableField("gender")
  private String gender;

  /** 年龄 */
  @TableField("age")
  private Integer age;

  /** 电话 */
  @TableField("tele")
  private String tele;

  /** 籍贯 */
  @TableField("place")
  private String place;

  /** 入学时间 */
  @TableField("ruxsj")
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
  @DateTimeFormat(
      pattern = "yyyy-MM-dd HH:mm",
      fallbackPatterns = {"yyyy-MM-dd'T'HH:mm:ss", "yyyy-MM-dd'T'HH:mm", "yyyy-MM-dd"})
  private Date ruxsj;

  /** 学号 */
  @TableField("numb")
  private String numb;

  /** 班级 */
  @TableField("clazzid")
  private String clazzid;

  @TableField(exist = false)
  private Clazz clazzidFrn;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getAvatar() {
    return avatar;
  }

  public void setAvatar(String avatar) {
    this.avatar = avatar;
  }

  public String getGender() {
    return gender;
  }

  public void setGender(String gender) {
    this.gender = gender;
  }

  public Integer getAge() {
    return age;
  }

  public void setAge(Integer age) {
    this.age = age;
  }

  public String getTele() {
    return tele;
  }

  public void setTele(String tele) {
    this.tele = tele;
  }

  public String getPlace() {
    return place;
  }

  public void setPlace(String place) {
    this.place = place;
  }

  public Date getRuxsj() {
    return ruxsj;
  }

  public void setRuxsj(Date ruxsj) {
    this.ruxsj = ruxsj;
  }

  public String getNumb() {
    return numb;
  }

  public void setNumb(String numb) {
    this.numb = numb;
  }

  public String getClazzid() {
    return clazzid;
  }

  public void setClazzid(String clazzid) {
    this.clazzid = clazzid;
  }

  public Clazz getClazzidFrn() {
    return clazzidFrn;
  }

  public void setClazzidFrn(Clazz v) {
    this.clazzidFrn = v;
  }
}

