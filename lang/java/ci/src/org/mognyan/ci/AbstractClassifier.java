package org.mognyan.ci;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.mognyan.ci.db.AccessData;
import org.mognyan.ci.db.dao.CategoryCountDao;
import org.mognyan.ci.db.dao.FeatureCountDao;

import org.mognyan.ci.filter.WordFilterTask;
import org.mognyan.ci.probability.WordProbability;
import org.mognyan.ci.util.LogUtil;

public abstract class AbstractClassifier implements Classifier{

	private final Map<String, Map<String, Integer>> wordOverCategoryCount = new HashMap<>();
	private final Map<String, Integer> categoryCount = new HashMap<>();
	private final static double WEIGHT = 1.0;
	private final static double AP = 0.5;
	private final WordProbability defaultProbability = new WordProbability(){
		@Override
		public double prob(String word, String categoryName){
			double catCount = getCategoryCount(categoryName);

			if(catCount > 0){
				return getFeatureCount(word, categoryName) / catCount;
			}else{
				return 0.0;
			}
		}
	};
	final WordFilterTask task;
	final String defaultClass;
	final Map<String, Double> thresholds = new HashMap<>();
	private Connection con;

	public AbstractClassifier(WordFilterTask task){
		this(task, "unknown");
	}

	public AbstractClassifier(WordFilterTask task, String defaultClass){
		this.task = task;
		this.defaultClass = defaultClass;
	}

	private Connection getConnection(){
		if(con == null){
			String driverName = "";
			try{
				driverName = AccessData.getDriverName();
				Class.forName(driverName);
				con = DriverManager.getConnection(AccessData.getURL(), AccessData.getUserId(), AccessData.getUserId());
				con.setAutoCommit(false);
			}catch(SQLException ex){
				LogUtil.error("Fail to get connection. : " + ex.getMessage());
			}catch(ClassNotFoundException ex){
				LogUtil.error("Missing driver class. : " + driverName);
			}
		}

		return con;
	}

	private void incFeatureCount(String word, String categoryName){
		FeatureCountDao dao = new FeatureCountDao(getConnection());
		double count = getFeatureCount(word, categoryName);

		if(count <= 0){
			dao.insert(word, categoryName);
		}else{
			dao.update(count + 1, word, categoryName);
		}

//		if (!wordOverCategoryCount.containsKey(word)) {
//			wordOverCategoryCount.put(word, new HashMap<String, Integer>());
//		}
//
//		Map<String, Integer> tmpWordCount = wordOverCategoryCount.get(word);
//
//		if (!tmpWordCount.containsKey(categoryName)) {
//			tmpWordCount.put(categoryName, 0);
//		}
//
//		int nowCount = tmpWordCount.get(categoryName) + 1;
//		tmpWordCount.put(categoryName, nowCount + 1);
//		wordOverCategoryCount.put(word, tmpWordCount);
	}

	private void incCategoryCount(String categoryName){
		CategoryCountDao dao = new CategoryCountDao(getConnection());
		double count = getCategoryCount(categoryName);

		if(count <= 0){
			dao.insert(categoryName);
		}else{
			dao.update(count + 1, categoryName);
		}

//		if (!categoryCount.containsKey(categoryName)) {
//			categoryCount.put(categoryName, 0);
//		}
//
//		int nowCount = categoryCount.get(categoryName);
//		categoryCount.put(categoryName, nowCount + 1);
	}

	double getFeatureCount(String word, String categoryName){
		FeatureCountDao dao = new FeatureCountDao(getConnection());
		double count = dao.select(word, categoryName);
		return count;

//		if (wordOverCategoryCount.containsKey(word)
//			&& wordOverCategoryCount.get(word).containsKey(categoryName)) {
//			double fc = wordOverCategoryCount.get(word).get(categoryName);
//			return fc;
//		} else {
//			return 0.0;
//		}
	}

	double getCategoryCount(String categoryName){
		CategoryCountDao dao = new CategoryCountDao(getConnection());
		double count = dao.select(categoryName);
		return count;

//		if (categoryCount.containsKey(categoryName)) {
//			return categoryCount.get(categoryName);
//		} else {
//			return 0;
//		}
	}

	double getTotalCategoryCount(){
		CategoryCountDao dao = new CategoryCountDao(getConnection());
		List<Double> counts = dao.findAllCounts();

		double total = 0;

		for(Double count:counts){
			total += Double.valueOf(count);
		}

		return total;



//		int total = 0;
//
//		for (Integer count : categoryCount.values()) {
//			total += Integer.valueOf(count);
//		}
//
//		return total;
	}

	Set<String> getCategories(){
		CategoryCountDao dao = new CategoryCountDao(getConnection());
		return dao.findAllCategories();

//		return categoryCount.keySet();
	}

	double featureProb(String word, String categoryName){
		double catCount = getCategoryCount(categoryName);

		if(catCount > 0){
			return getFeatureCount(word, categoryName) / catCount;
		}else{
			return 0.0;
		}
	}

	double weightProb(String word, String categoryName, WordProbability probability){
		double totalFeatureCount = 0.0;

		for(String existingCategory:getCategories()){
			totalFeatureCount += getFeatureCount(word, existingCategory);
		}

		double nowProb = probability.prob(word, categoryName);

		double weightedProb = ((WEIGHT * AP) + (totalFeatureCount * nowProb)) / (WEIGHT + totalFeatureCount);

		return weightedProb;
	}

	double weightProb(String word, String categoryName){
		return weightProb(word, categoryName, defaultProbability);
	}

	@Override
	public void train(String doc, String category){
		Map<String, Integer> result = task.get(doc);

		for(String word:result.keySet()){
			incFeatureCount(word, category);
		}

		incCategoryCount(category);

		try(Connection _con = getConnection()){
			_con.commit();
		}catch(SQLException ex){
			LogUtil.error("Fail to update train data. : " + ex.getMessage());
		}
	}
}
