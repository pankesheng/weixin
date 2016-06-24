package com.weixin.common;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
// 功能类：  对list<实体> 集合 根据其中的某个字段进行排序  
public class SortList<T>{   
    @SuppressWarnings({ "unchecked", "rawtypes" })
	public void Sort(List<T> list, final String method, final String sort){  
        Collections.sort(list, new Comparator() {             
            public int compare(Object a, Object b) {  
                int ret = 0;  
                try{  
                    Method m1 = ((T)a).getClass().getMethod(method);  
                    Method m2 = ((T)b).getClass().getMethod(method);  
                    if(sort != null && "desc".equals(sort))//倒序  
                        ret = m2.invoke(((T)b)).toString().compareTo(m1.invoke(((T)a)).toString());   
                    else//正序  
                        ret = m1.invoke(((T)a)).toString().compareTo(m2.invoke(((T)b)).toString());  
                }catch(NoSuchMethodException ne){  
                    System.out.println(ne);  
                }catch(IllegalAccessException ie){  
                    System.out.println(ie);  
                }catch(InvocationTargetException it){  
                    System.out.println(it);  
                }  
                return ret;  
            }  
         });  
    }  
}  
