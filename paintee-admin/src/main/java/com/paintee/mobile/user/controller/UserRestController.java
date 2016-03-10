/**
@file UserRestController.java
@section 파일생성정보
|    항  목       |      내  용       |
| :-------------: | -------------   |
| File name | UserRestController.java |    
| Package | com.paintee.mobile.user.controller |    
| Project name | paintee-admin |    
| Type name | UserRestController |    
| Company | Paintee | 
| Create Date | 2016 2016. 3. 4. 오후 11:45:30 |
| Author | Administrator |
| File Version | v1.0 |
*/
package com.paintee.mobile.user.controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.paintee.mobile.support.obejct.LoginedUserVO;
import com.paintee.mobile.user.service.UserService;

/**
@class UserRestController
com.paintee.mobile.user.controller \n
   ㄴ UserRestController.java
 @section 클래스작성정보
    |    항  목       |      내  용       |
    | :-------------: | -------------   |
    | Company | Paintee |
    | Author | Administrator |
    | Date | 2016. 3. 4. 오후 11:45:30 |
    | Class Version | v1.0 |
    | 작업자 | Administrator |
 @section 상세설명
 - 사용자 controller
*/
@RestController(value="com.paintee.mobile.user.controller.UserRestController")
public class UserRestController {
	private final static Logger logger = LoggerFactory.getLogger(UserRestController.class);

	@Autowired
	private UserService userService;

	/**
	 @fn follow
	 @brief 함수 간략한 설명 : followId 의 사용자가 followingId 사용자를 follow 한다.
	 @remark
	 - 함수의 상세 설명 : followId 의 사용자가 followingId 사용자를 follow 한다.
	 @param followingId
	 @return
	 @throws Exception 
	*/
	@RequestMapping(value="/api/user/{followingId}/follow", method={RequestMethod.POST})
	public Map<String, Object> follow(@PathVariable String followingId, LoginedUserVO loginedUserVO) throws Exception {
		Map<String, Object> resultMap = new HashMap<>();

		logger.debug("loginedUserVO:{}", loginedUserVO);
		int errorNo = 0;
		String errorMsg = "";

		//TODO: 로그인 hash 구현시 hash 에 해당하는 사용자 id 를 넣어주어야 함.
		String followId = loginedUserVO.getUserId();

		errorNo = userService.follow(followId, followingId);

		resultMap.put("errorNo", errorNo);
		resultMap.put("errorMsg", errorMsg);

		return resultMap;
	}
}
