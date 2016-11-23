package com.turingpoint.dbmodel.model;

public enum QuestionType {
	MULTIPLE_CHOICE(0), FILL_IN_BLANK(1), MULTIPLE_ANSWER(2), NUMERIC_RESPONSE(3);
	
	private int type;
	
	QuestionType(int type){
		this.type = type;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}
}