/**
@file LoginController.java
@section 파일생성정보
|    항  목       |      내  용       |
| :-------------: | -------------   |
| File name | LoginController.java |    
| Package | com.paintee.admin.test.controller |    
| Project name | paintee-admin |    
| Type name | LoginController |    
| Company | Paintee | 
| Create Date | 2016 2016. 2. 27. 오후 5:14:46 |
| Author | Administrator |
| File Version | v1.0 |
*/
package com.paintee.admin.login.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.paintee.common.repository.entity.Purchase;

/**
@class LoginController
com.paintee.admin.test.controller \n
   ㄴ LoginController.java
 @section 클래스작성정보
    |    항  목       |      내  용       |
    | :-------------: | -------------   |
    | Company | Paintee |
    | Author | Administrator |
    | Date | 2016. 2. 27. 오후 5:14:46 |
    | Class Version | v1.0 |
    | 작업자 | Administrator |
 @section 상세설명
 - jsp view 를 포함한 controller
*/
@Controller(value="com.paintee.admin.login.LoginController")
@RequestMapping(value="/admin/login")
public class LoginController {
	
	/**
	 @fn test
	 @brief 함수 간략한 설명 : 로그인 처리
	 @remark
	 - 함수의 상세 설명 : 
	 @return 
	*/
	@RequestMapping(value="/login")
	public String login(String id, String pass, HttpSession session) {
		// 별도의 테이블 없이 특정 사용자만 허용
		List<String> users = new ArrayList<>();
		users.add("admin:1234");
		users.add("manager:1234");
		
		String result = "redirect:/";
		if (users.indexOf(id + ":" + pass) == -1) {
			return "redirect:/admin/login/loginForm";
		}
		
		session.setAttribute("user", id);
		
		return result;
	}
	
	@RequestMapping(value="/logout")
	public String logout(HttpSession session) {
		session.invalidate();
		return "redirect:/";
	}
}