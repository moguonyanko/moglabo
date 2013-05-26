package org.mognyan.ci;

public class Feature {
	private final String name;
	private final String categoryName;
	private final int count;

	public Feature(String name, String categoryName, int count) {
		this.name = name;
		this.categoryName = categoryName;
		this.count = count;
	}

	public String getName() {
		return name;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public int getCount() {
		return count;
	}

	@Override
	public boolean equals(Object obj) {
		if(obj == null){
			return false;
		}

		if(obj instanceof Feature){
			Feature other = (Feature)obj;
			return name.equals(other.getName()) &&
					categoryName.equals(other.getCategoryName()) &&
					count == other.getCount();
		}else{
			return false;
		}
	}

	@Override
	public int hashCode() {
		return name.hashCode()^categoryName.hashCode()^count^7;
	}

	@Override
	public String toString() {
		return "name : " + name + ", category name : " + categoryName + ", count : " + count;
	}
}
