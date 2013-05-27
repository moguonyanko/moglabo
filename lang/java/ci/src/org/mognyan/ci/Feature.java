package org.mognyan.ci;

public class Feature {
	private final String word;
	private final String categoryName;
	private final int count;

	public Feature(String word, String categoryName, int count) {
		this.word = word;
		this.categoryName = categoryName;
		this.count = count;
	}

	public String getWord() {
		return word;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public int getCount() {
		return count;
	}

	@Override
	public boolean equals(Object obj) {
		if(obj == null || word == null || categoryName == null){
			return false;
		}

		if(obj instanceof Feature){
			Feature other = (Feature)obj;
			return word.equals(other.getWord()) &&
					categoryName.equals(other.getCategoryName()) &&
					count == other.getCount();
		}else{
			return false;
		}
	}

	@Override
	public int hashCode() {
		return word.hashCode()^categoryName.hashCode()^count^7;
	}

	@Override
	public String toString() {
		return "word : " + word + ", category name : " + categoryName + ", count : " + count;
	}
}
