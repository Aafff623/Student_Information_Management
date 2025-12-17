package com.codeying.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import org.springframework.format.annotation.DateTimeFormat;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;
import java.util.List;

import java.io.Serializable;
/** 成绩实体类 */
@TableName("tb_score")
public class Score implements Serializable {

  /** 成绩主键 */
  @TableId private String id;

  /** 学生 */
  @TableField("sid")
  private String sid;

  @TableField(exist = false)
  private Student sidFrn;
  /** 课程 */
  @TableField("cid")
  private String cid;

  @TableField(exist = false)
  private Course cidFrn;
  /** 创建时间 */
  @TableField("createtime")
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
  @DateTimeFormat(
      pattern = "yyyy-MM-dd HH:mm",
      fallbackPatterns = {"yyyy-MM-dd'T'HH:mm:ss", "yyyy-MM-dd'T'HH:mm", "yyyy-MM-dd"})
  private Date createtime;

  /** 分数 */
  @TableField("score")
  private Integer score;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getSid() {
    return sid;
  }

  public void setSid(String sid) {
    this.sid = sid;
  }

  public Student getSidFrn() {
    return sidFrn;
  }

  public void setSidFrn(Student v) {
    this.sidFrn = v;
  }

  public String getCid() {
    return cid;
  }

  public void setCid(String cid) {
    this.cid = cid;
  }

  public Course getCidFrn() {
    return cidFrn;
  }

  public void setCidFrn(Course v) {
    this.cidFrn = v;
  }

  public Date getCreatetime() {
    return createtime;
  }

  public void setCreatetime(Date createtime) {
    this.createtime = createtime;
  }

  public Integer getScore() {
    return score;
  }

  public void setScore(Integer score) {
    this.score = score;
  }
}

