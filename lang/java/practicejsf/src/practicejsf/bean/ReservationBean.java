package practicejsf.bean;

import java.time.LocalDate;
import java.util.function.UnaryOperator;

import javax.faces.application.FacesMessage;
import javax.faces.bean.ManagedBean;
import javax.faces.context.FacesContext;

@ManagedBean(name = "reservationBean1")
public class ReservationBean {

	private LocalDate startDate;
	private LocalDate endDate;

	private static final UnaryOperator<LocalDate> NEXT_DATE = date -> date.plusDays(1);
	
	public LocalDate getStartDate() {
		if (startDate == null) {
			startDate = LocalDate.now();
		}
		
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = NEXT_DATE.apply(startDate);
	}

	public LocalDate getEndDate() {
		if(endDate == null){
			endDate = NEXT_DATE.apply((getStartDate()));
		}
		
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = NEXT_DATE.apply(endDate);
	}
	
	private void putReservationInDatabase(){
		/**
		 * 実際はここでデータベースへの登録などの処理を行う。
		 */
	}
	
	public String register() {
		LocalDate today = LocalDate.now();
		
		String messageContent = null;
		if(startDate.isBefore(today)){
			messageContent = "出発日に過去の日付を指定することはできません。";
		} else if(!startDate.isBefore(endDate)) {
			messageContent = "出発日は到着日より前でなければなりません。";			
		}
		
		if(messageContent == null){
			putReservationInDatabase();
			return "show-dates";
		}else{
			startDate = null;
			endDate = null;
			
			FacesMessage errorMessage = new FacesMessage(messageContent);
			errorMessage.setSeverity(FacesMessage.SEVERITY_ERROR);
			FacesContext.getCurrentInstance().addMessage(null, errorMessage);
			
			/**
			 * nullを返して現在のページを再表示させる。
			 */
			return null;
		}
	}
	
}
