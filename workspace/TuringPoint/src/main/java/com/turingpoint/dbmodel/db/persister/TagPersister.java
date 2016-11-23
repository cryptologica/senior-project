package com.turingpoint.dbmodel.db.persister;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

import com.turingpoint.dbmodel.db.mapping.HibernateUtil;
import com.turingpoint.dbmodel.db.mapping.QuestionTags;
import com.turingpoint.dbmodel.db.mapping.Tag;

public class TagPersister extends HibernateUtil{

	public static Tag createTagByName(String tagName) {
		Tag newTag = new Tag();
		
		newTag.setTagName(tagName);
		newTag.save();
		
		return newTag;
	}
	
	@SuppressWarnings("unchecked")
	public static List<Tag> getAllTags()
	{
		Session session = null;
	    try{
	        session = getSession();
			//Criteria criteria = session.createCriteria(Tag.class);
	        Criteria criteria = HibernateUtil.getCriteria(session, Tag.class);
			return (List<Tag>) criteria.list();
	      } finally {
	        session.close();
	      }
	}
	
	
}
