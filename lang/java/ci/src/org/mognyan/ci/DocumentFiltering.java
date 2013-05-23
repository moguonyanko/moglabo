package org.mognyan.ci;

import java.util.*;
import java.util.regex.*;

public class DocumentFiltering {
	private static boolean acceptWords(String word){

		if(word == null){
			return false;
		}

		if(word.isEmpty()){
			return false;
		}

		int wordLength = word.length();

		return 2 < wordLength && wordLength < 20;
	}

	public static Map<String, Integer> getWords(String doc){
		Map<String, Integer> result = new HashMap<String, Integer>();
		Pattern splitter = Pattern.compile("[\\s\\p{Punct}]");
		String[] words = splitter.split(doc);

		for(String word : words){
			if(acceptWords(word)){
				if(result.containsKey(word)){
					int nowCount = result.get(word);
					result.put(word, nowCount + 1);
				}else{
					result.put(word, 1);
				}
			}
		}

		return result;
	}
}
