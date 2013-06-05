package org.mognyan.ci;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.*;

import org.mognyan.ci.db.AccessData;
import org.mognyan.ci.db.dao.CategoryCountDao;
import org.mognyan.ci.db.dao.FeatureCountDao;
import org.mognyan.ci.filter.WordFilterTask;
import org.mognyan.ci.probability.WordProbability;
import org.mognyan.ci.util.LogUtil;
import org.mognyan.ci.util.SQLUtil;

public abstract class AbstractClassifier implements Classifier{

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

	public AbstractClassifier(WordFilterTask task){
		this(task, "unknown");
	}

	public AbstractClassifier(WordFilterTask task, String defaultClass){
		this.task = task;
		this.defaultClass = defaultClass;
	}

	/**
	 * Get database connection.
	 * 
	 * 
	 * 
	 * @todo
	 * Use DataSource.
	 * @return 
	 */
	private Connection getConnection(){
		Connection con = null;

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
	}

	private void incCategoryCount(String categoryName){
		CategoryCountDao dao = new CategoryCountDao(getConnection());
		double count = getCategoryCount(categoryName);

		if(count <= 0){
			dao.insert(categoryName);
		}else{
			dao.update(count + 1, categoryName);
		}
	}

	double getFeatureCount(String word, String categoryName){
		FeatureCountDao dao = new FeatureCountDao(getConnection());
		double count = dao.select(word, categoryName);
		return count;
	}

	double getCategoryCount(String categoryName){
		CategoryCountDao dao = new CategoryCountDao(getConnection());
		double count = dao.select(categoryName);
		return count;
	}

	double getTotalCategoryCount(){
		CategoryCountDao dao = new CategoryCountDao(getConnection());
		List<Double> counts = dao.findAllCounts();

		double total = 0;

		for(Double count:counts){
			total += Double.valueOf(count);
		}

		return total;
	}

	Set<String> getCategories(){
		CategoryCountDao dao = new CategoryCountDao(getConnection());
		return dao.findAllCategories();
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

		Connection _con = getConnection();
		try{
			_con.commit();
		}catch(SQLException ex){
			LogUtil.error("Fail to update trainning data and start rollback... : " + ex.getMessage());
			SQLUtil.rollbackConnection(_con);
		}
	}
}
