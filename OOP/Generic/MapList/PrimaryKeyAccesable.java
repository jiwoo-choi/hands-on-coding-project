package com.MapList;

/**
 * List + Map 이 통합된 인터페이스를 가지기 위해서는 인터페이스에 담아야할 객체가 Primary Key를 반드시 가져야합니다.
 * @author jiwoochoi
 *
 */
public interface PrimaryKeyAccesable {
	String getPrimaryKey();
}
