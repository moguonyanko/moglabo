package org.mognyan.ci;

import java.util.*;
import java.util.regex.*;

import org.mognyan.ci.filter.DefaultWordFilter;
import org.mognyan.ci.filter.WordFilterTask;
import org.mognyan.ci.filter.WordFilter;

public class DocumentFiltering implements WordFilterTask {

	private static final Pattern DOCUMENT_SPLITTER = Pattern.compile("[\\s\\p{Punct}]");

	private final WordFilter wordFilter;

	public DocumentFiltering() {
		this(new DefaultWordFilter());
	}

	public DocumentFiltering(WordFilter wordFilter) {
		this.wordFilter = wordFilter;
	}

	public Map<String, Integer> get(String doc){
		Map<String, Integer> result = new HashMap<String, Integer>();
		String[] words = DOCUMENT_SPLITTER.split(doc);

		for(String word : words){
			if(wordFilter.accept(word)){
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
