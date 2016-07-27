package practicejsf.bean;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;

import practicejsf.bean.service.StateInfo;

@ManagedBean
@SessionScoped
public class LocationBean implements Serializable {

	private static final long serialVersionUID = -42913227001L;
	
	private String state;
	private String cityPopulation;
	
	private boolean cityListDisabled = true;
	
	private final StateInfo stateInfo = new StateInfo();
	
	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
		/**
		 * Stateが切り替わった沖にpopulation参照部分も初期状態に戻るように
		 * 空文字を代入している。
		 */
		cityPopulation = "";
		cityListDisabled = false;
	}

	/**
	 * RequestScopedにするとsetCityPopulationが呼び出されないため
	 * getCityPopulationの結果が常にnullになる。
	 */
	public String getCityPopulation() {
		return cityPopulation;
	}

	public void setCityPopulation(String cityPopulation) {
		this.cityPopulation = cityPopulation;
	}

	public boolean isCityListDisabled() {
		return cityListDisabled;
	}

	public List<String> getStates() {
		return stateInfo.getStateNames();
	}
	
	public Map<String, String> getCities() {
		return stateInfo.getCityNameMap(state);
	}
	
}
