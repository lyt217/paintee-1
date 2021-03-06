/**
@file FollowServiceImpl.java
@section 파일생성정보
|    항  목       |      내  용       |
| :-------------: | -------------   |
| File name | FollowServiceImpl.java |    
| Package | com.paintee.mobile.follow.service |    
| Project name | paintee-admin |    
| Type name | FollowServiceImpl |    
| Company | Paintee | 
| Create Date | 2016 2016. 3. 4. 오후 11:24:22 |
| Author | Administrator |
| File Version | v1.0 |
*/
package com.paintee.mobile.follow.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.paintee.common.repository.entity.FileInfo;
import com.paintee.common.repository.entity.FileInfoExample;
import com.paintee.common.repository.entity.Follow;
import com.paintee.common.repository.entity.FollowExample;
import com.paintee.common.repository.entity.vo.FollowSearchVO;
import com.paintee.common.repository.entity.vo.FollowVO;
import com.paintee.common.repository.helper.FileInfoHelper;
import com.paintee.common.repository.helper.FollowHelper;
import com.paintee.common.repository.helper.UserHelper;

/**
@class FollowServiceImpl
com.paintee.mobile.follow.service \n
   ㄴ FollowServiceImpl.java
 @section 클래스작성정보
    |    항  목       |      내  용       |
    | :-------------: | -------------   |
    | Company | Paintee |
    | Author | Administrator |
    | Date | 2016. 3. 4. 오후 11:24:22 |
    | Class Version | v1.0 |
    | 작업자 | Administrator |
 @section 상세설명
 - follow service 구현채
*/
@Service(value="com.paintee.mobile.follow.service.FollowServiceImpl")
public class FollowServiceImpl implements FollowService {
	private final static Logger logger = LoggerFactory.getLogger(FollowServiceImpl.class);

	@Autowired
	private FollowHelper followHelper;
	
	@Autowired
	private FileInfoHelper fileInfoHelper;
	
	@Override
	public Map<String, Object> getFollowPaintingInfo(FollowSearchVO searchVO) {
		
		
		List<FollowVO> list = followHelper.selectFollowPaintingList(searchVO);
		logger.debug("list ::: {}", list);
		
		// 파일정보 조회
		for (FollowVO follow : list) {
			FileInfoExample fileInfoExample = new FileInfoExample();
			FileInfoExample.Criteria fileWhere = fileInfoExample.createCriteria();
			fileWhere.andFileGroupSeqEqualTo(follow.getFileGroupSeq());
	
			List<FileInfo> fileInfoList = fileInfoHelper.selectByExample(fileInfoExample);
	
			if(fileInfoList != null && fileInfoList.size() > 0) {
				FileInfo fileInfo = fileInfoList.get(0);
				follow.setFileId(fileInfo.getId());
			}
		}
		
		Map<String, Object> result = new HashMap<>();
//		result.put("count", count);
		result.put("list", list);
		return result;
	}

	@Override
	public FollowVO getFollowCount(FollowSearchVO search) {
		return followHelper.selectFollowCount(search);
	}

	
	@Override
	public List<FollowVO> getFollowsList(FollowSearchVO search) {
		return followHelper.selectFollowsList(search);
	}
	
	@Override
	public List<FollowVO> getFollowingList(FollowSearchVO search) {
		return followHelper.selectFollowingList(search);
	}

	@Override
	public void addFollows(Follow follow) {
		followHelper.insertFollowByName(follow);
	}

	@Override
	public void delFollows(Follow follow) {
		followHelper.deleteFollowByName(follow);
	}
}
