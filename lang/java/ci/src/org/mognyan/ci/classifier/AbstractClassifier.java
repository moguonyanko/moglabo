package org.mognyan.ci.classifier;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.*;

import org.mognyan.ci.classifier.db.AccessData;
import org.mognyan.ci.classifier.db.dao.CategoryCountDao;
import org.mognyan.ci.classifier.db.dao.FeatureCountDao;
import org.mognyan.ci.classifier.filter.WordFilterTask;
import org.mognyan.ci.classifier.probability.WordProbability;
import org.mognyan.ci.classifier.util.LogUtil;

public abstract class AbstractClassifier implements Classifier{

	private final static double WEIGHT = 1.0;
	private final static double AP = 0.5;
	private final WordProbability defaultProbability = new WordProbability(){
		@Override
		public double prob(String word, String categoryName) throws ClassifierException{
			try{
				double catCount = getCategoryCount(categoryName);

				if(catCount > 0){
					return getFeatureCount(word, categoryName) / catCount;
				}else{
					return 0.0;
				}

			}catch(SQLException sqle){
				throw new ClassifierException("Misstake calculate prob.");
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

	/**
	 * Get database connection.
	 *
	 *
	 *
	 * @todo Use DataSource.
	 * @return
	 */
	private Connection getConnection(){
		if(con == null){
			start();
		}

		return con;
	}

	public void start(){
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

	private void incFeatureCount(String word, String categoryName) throws SQLException{
		FeatureCountDao dao = new FeatureCountDao(getConnection());
		double count = getFeatureCount(word, categoryName);

		if(count <= 0){
			dao.insert(word, categoryName);
		}else{
			dao.update(count + 1, word, categoryName);
		}
	}

	private void incCategoryCount(String categoryName) throws SQLException{
		CategoryCountDao dao = new CategoryCountDao(getConnection());
		double count = getCategoryCount(categoryName);

		if(count <= 0){
			dao.insert(categoryName);
		}else{
			dao.update(count + 1, categoryName);
		}
	}

	double getFeatureCount(String word, String categoryName) throws SQLException{
		FeatureCountDao dao = new FeatureCountDao(getConnection());
		double count = dao.select(word, categoryName);
		return count;
	}

	double getCategoryCount(String categoryName) throws SQLException{
		CategoryCountDao dao = new CategoryCountDao(getConnection());
		double count = dao.select(categoryName);
		return count;
	}

	double getTotalCategoryCount() throws SQLException{
		CategoryCountDao dao = new CategoryCountDao(getConnection());
		List<Double> counts = dao.findAllCounts();

		double total = 0;

		for(Double count : counts){
			total += Double.valueOf(count);
		}

		return total;
	}

	Set<String> getCategories() throws SQLException{
		CategoryCountDao dao = new CategoryCountDao(getConnection());
		return dao.findAllCategories();
	}

	double featureProb(String word, String categoryName) throws SQLException{
		double catCount = getCategoryCount(categoryName);

		if(catCount > 0){
			return getFeatureCount(word, categoryName) / catCount;
		}else{
			return 0.0;
		}
	}

	double weightProb(String word, String categoryName, WordProbability probability) throws ClassifierException{
		double totalFeatureCount = 0.0;

		try{
			for(String existingCategory : getCategories()){
				totalFeatureCount += getFeatureCount(word, existingCategory);
			}
		}catch(SQLException sqle){
			throw new ClassifierException("Misstake calculate prob.");
		}

		double nowProb = probability.prob(word, categoryName);

		double weightedProb = ((WEIGHT * AP) + (totalFeatureCount * nowProb)) / (WEIGHT + totalFeatureCount);

		return weightedProb;
	}

	double weightProb(String word, String categoryName) throws ClassifierException{
		return weightProb(word, categoryName, defaultProbability);
	}

	@Override
	public void train(String doc, String category) throws ClassifierException{
		Map<String, Integer> result = task.get(doc);

		try{
			for(String word : result.keySet()){
				incFeatureCount(word, category);
			}

			incCategoryCount(category);
		}catch(SQLException sqle){
			throw new ClassifierException("Mistake training!");
		}

	}

	public void end(boolean fail){
		try(Connection _con = getConnection()){
			if(!fail){
				_con.commit();
				LogUtil.info("Classfier finished.");
			}else{
				_con.rollback();
				LogUtil.error("Classifier operation failed and rollbacked.");
			}
		}catch(SQLException ex){
			LogUtil.error("Fail to update trainning data and close connection... : " + ex.getMessage());
		}
	}
}
