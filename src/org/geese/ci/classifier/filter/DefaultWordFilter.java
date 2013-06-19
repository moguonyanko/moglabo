package org.geese.ci.classifier.filter;

public class DefaultWordFilter implements WordFilter {

	@Override
	public boolean accept(String doc) {

		if(doc == null){
			return false;
		}

		if(doc.isEmpty()){
			return false;
		}

		int wordLength = doc.length();

		return 2 < wordLength && wordLength < 20;
	}

}
