/**
@file FileInfoGenerator.java
@section 파일생성정보
|    항  목       |      내  용       |
| :-------------: | -------------   |
| File name | FileInfoGenerator.java |    
| Package | com.paintee.common.file.service |    
| Project name | paintee-admin |    
| Type name | FileInfoGenerator |    
| Company | Paintee | 
| Create Date | 2016 2016. 3. 1. 오후 11:58:45 |
| Author | Administrator |
| File Version | v1.0 |
*/
package com.paintee.common.file.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import com.paintee.common.repository.entity.FileInfo;

/**
@class FileInfoGenerator
com.paintee.common.file.service \n
   ㄴ FileInfoGenerator.java
 @section 클래스작성정보
    |    항  목       |      내  용       |
    | :-------------: | -------------   |
    | Company | Paintee |
    | Author | Administrator |
    | Date | 2016. 3. 1. 오후 11:58:45 |
    | Class Version | v1.0 |
    | 작업자 | Administrator |
 @section 상세설명
 - 파일 정보 생성 및 temp 디렉토리의 파일을 정해진 디렉토리에 복사 하기위한 유틸
*/
@Component(value="com.paintee.common.file.service.FileInfoGenerator")
public class FileInfoGenerator {
	private final static Logger logger = LoggerFactory.getLogger(FileInfoGenerator.class);

	@Autowired
	private FilePathGenerator filePathGenerator;

	/**
	 @fn makeFileInfo
	 @brief 함수 간략한 설명 : 첨부파일 정보 생성
	 @remark
	 - 함수의 상세 설명 : 첨부파일 정보 생성
	 @param multipartFiles
	 @return 
	*/
	public List<FileInfo> makeFileInfo(MultipartFile[] multipartFiles) throws Exception {
		return makeFileInfo(multipartFiles, null, null);
	}

	/**
	 @fn makeFileInfo
	 @brief 함수 간략한 설명 : 첨부파일 정보 생성
	 @remark
	 - 함수의 상세 설명 : 첨부파일 정보 생성
	 @param multipartFiles
	 @param middlePath
	 @return 
	*/
	public List<FileInfo> makeFileInfo(MultipartFile[] multipartFiles, String middlePath) throws Exception {
		return makeFileInfo(multipartFiles, middlePath, null);
	}

	/**
	 @fn makeFileInfo
	 @brief 함수 간략한 설명 : 첨부파일 정보 생성
	 @remark
	 - 함수의 상세 설명 : 첨부파일 정보 생성
	 @param multipartFiles
	 @param middlePath
	 @param displayName
	 @return 
	*/
	public List<FileInfo> makeFileInfo(MultipartFile[] multipartFiles, String middlePath, String[] displayNames) throws Exception {
		List<FileInfo> fileInfoList= new ArrayList<FileInfo>();

		MultipartFile multipartFile = null;
		String displayName = null;

		int count = 0;

		if(middlePath != null && middlePath.trim().length() > 0) {
			count++;
		}
		if(displayNames != null && displayNames.length > 0) {
			count++;
		}

		for(int i=0; multipartFiles != null && i<multipartFiles.length; i++) {
			multipartFile = multipartFiles[i];

			displayName = null;

			if(multipartFile != null) {
				switch (count) {
					case 2:
						displayName = displayNames[i];
					case 1:
					default:
						fileInfoList.add(makeFileInfo(multipartFiles[i], middlePath, displayName));
						break;
				}
			}
		}

		return fileInfoList;
	}

	/**
	 @fn makeFileInfo
	 @brief 함수 간략한 설명 : 첨부파일 정보 생성
	 @remark
	 - 함수의 상세 설명 : 첨부파일 정보 생성
	 @param multipartFile
	 @return 
	*/
	public FileInfo makeFileInfo(MultipartFile multipartFile) throws Exception {

		return makeFileInfo(multipartFile, null, null);
	}

	/**
	 @fn makeFileInfo
	 @brief 함수 간략한 설명 : 첨부파일 정보 생성
	 @remark
	 - 함수의 상세 설명 : 첨부파일 정보 생성
	 @param multipartFile
	 @return 
	*/
	public FileInfo makeFileInfo(MultipartFile multipartFile, String middlePath) throws Exception {

		return makeFileInfo(multipartFile, middlePath, null);
	}

	/**
	 @fn makeFileInfo
	 @brief 함수 간략한 설명 : 첨부파일 정보 생성
	 @remark
	 - 함수의 상세 설명 : 첨부파일 정보 생성
	 @param multipartFile
	 @param middlePath
	 @param altNm
	 @param extraFiled
	 @return 
	*/
	public FileInfo makeFileInfo(MultipartFile multipartFile, String middlePath, String displayName) throws Exception {
		Date today = new Date();

		String filePath = filePathGenerator.generateFilPath(middlePath);
		String newId = UUID.randomUUID().toString();

		FileInfo fileInfo = new FileInfo();
		fileInfo.setId(newId);
		fileInfo.setName(newId);
		fileInfo.setOriName(multipartFile.getOriginalFilename());
		fileInfo.setExtension(FilenameUtils.getExtension(multipartFile.getOriginalFilename()));
		fileInfo.setPath(filePath);
		fileInfo.setContentType(multipartFile.getContentType());
		fileInfo.setSize(multipartFile.getSize());
		fileInfo.setDisplayName(displayName);
		fileInfo.setCreatedDate(today);

		StringBuilder fullPath = new StringBuilder();
		fullPath.append(filePathGenerator.getAbsoluteFilPath(filePath));
		fullPath.append(newId);

		try {
			File file = new File(filePathGenerator.getAbsoluteFilPath(filePath));

			if(!file.exists()) {
				logger.info("created {} directory", filePath);
				file.mkdirs();
			}

			FileCopyUtils.copy(multipartFile.getBytes(), new File(fullPath.toString()));
		} catch (IOException e) {
			logger.error("exception [{}]", e);
			throw e;
		}

		return fileInfo;
	}
}
