package org.mognyan.ci;

public class Category {

	private final String name;
	private final int count;

	public Category(String name, int count){
		this.name = name;
		this.count = count;
	}

	public String getName() {
		return name;
	}

	public int getCount() {
		return count;
	}
	@Override
	public boolean equals(Object obj) {
		if(obj == null){
			return false;
		}

		if(obj instanceof Category){
			Category other = (Category)obj;
			return name.equals(other.getName()) && count == other.getCount();
		}else{
			return false;
		}
	}

	@Override
	public int hashCode() {
		return name.hashCode()^count^7;
	}

	@Override
	public String toString() {
		return "name : " + name + ", count : " + count;
	}
}
