package org.geese.ci.classifier;

import java.sql.SQLException;

public class TrainException extends SQLException{

	private final String errorWord;
	private final String errorCategory;

	public TrainException(String errorWord, String errorCategory, String reason){
		super(reason);
		this.errorWord = errorWord;
		this.errorCategory = errorCategory;
	}

	public final String getErrorWord(){
		return errorWord;
	}

	public final String getErrorCategory(){
		return errorCategory;
	}
}
