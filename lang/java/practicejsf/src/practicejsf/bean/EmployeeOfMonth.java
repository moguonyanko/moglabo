package practicejsf.bean;

import javax.faces.bean.ManagedBean;

import practicejsf.bean.type.Nameable;

@ManagedBean
public class EmployeeOfMonth implements Nameable {
	
	private String firstName;
	private String lastName;
	private String nominationReason;

	@Override
	public String getFirstName() {
		return firstName;
	}

	@Override
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	@Override
	public String getLastName() {
		return lastName;
	}

	@Override
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getNominationReason() {
		return nominationReason;
	}
	
	public void setNominationReason(String nominationReason) {
		this.nominationReason = nominationReason;
	}
	
	public String recodeVote(){
		storeVoteSomehow();
		
		return "show-emploee-vote";
	}

	private void storeVoteSomehow() {
		/**
		 * 実際は入力情報を保存するなどの処理を行う。
		 */
	}
	
}
