/**
@file PaintingService.java
@section 파일생성정보
|    항  목       |      내  용       |
| :-------------: | -------------   |
| File name | PaintingService.java |    
| Package | com.paintee.mobile.painting.service |    
| Project name | paintee-admin |    
| Type name | PaintingService |    
| Company | Paintee | 
| Create Date | 2016 2016. 3. 2. 오후 10:58:49 |
| Author | Administrator |
| File Version | v1.0 |
*/
package com.paintee.mobile.painting.service;

import java.util.Map;

/**
@class PaintingService
com.paintee.mobile.painting.service \n
   ㄴ PaintingService.java
 @section 클래스작성정보
    |    항  목       |      내  용       |
    | :-------------: | -------------   |
    | Company | Paintee |
    | Author | Administrator |
    | Date | 2016. 3. 2. 오후 10:58:49 |
    | Class Version | v1.0 |
    | 작업자 | Administrator |
 @section 상세설명
 - 그림에 대한 service
*/
public interface PaintingService {
	/**
	 @fn getPaintingInfo
	 @brief 함수 간략한 설명 : 그림에 대한 상세 정보 조회
	 @remark
	 - 함수의 상세 설명 : 그림에 대한 상세 정보를 조회 한다.
	 @param paintingId
	 @return 
	*/
	public Map<String, Object> getPaintingInfo(String paintingId) throws Exception;
}
