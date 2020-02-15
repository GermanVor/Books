import React from 'react'
import Enzyme, { shallow, mount, render } from 'enzyme'
import Paggination from '../components/Pagination'
import renderer from 'react-test-renderer';

describe('<Paggination /> ', () => {
  it("render correctly Paggination component ", () => {
    const Pag = renderer.create(<Paggination DBSize={7} LimitMenuArr = {[3,5]} />).toJSON();
    expect(Pag).toMatchSnapshot();
  });

  it("check the type of Paggination value ", () => {
    const DBSize =100, limit = 5, page = 10;
    const Pag = mount(<Paggination  
      DBSize = { DBSize } 
      onClick = { ()=>true }
      limit = { limit }
      page = { page }
      LimitMenuArr = { [3,5] }
    />);
    expect(Pag.prop("DBSize")).toBe(DBSize);
    expect(Pag.prop("limit")).toBe(limit);
    expect(Pag.prop("page")).toBe(page);
    expect(Pag.find(".btn-group button")).toHaveLength(Math.ceil(DBSize/limit));
    expect(Pag.find(".btn-group button[page="+page+"].activPagin")).toHaveLength(1);
    expect(Pag.find(".LimitMenu button[limit="+limit+"].activPagin")).toHaveLength(1);


  });

  it("check the resize operation ", () => {
    const DBSize = 100, limit = 5, page = 10, LimitMenuArr = [3,5,10];
    const Pag = mount(<Paggination  
      DBSize = { DBSize } 
      onClick = { ()=>true }
      limit = { limit }
      page = { page }
      LimitMenuArr = { LimitMenuArr }
    />);
    expect(Pag.find(".btn-group button")).toHaveLength(Math.ceil(DBSize/limit));
    
    LimitMenuArr.forEach( el => {
      Pag.find('.LimitMenu button[limit='+el+']').simulate('click');
      expect(Pag.find(".btn-group button")).toHaveLength(Math.ceil(DBSize/el));
    })
  });


  it("check the incorrect limit and page props ", () => {
    const DBSize = 100, limit = -5, LimitMenuArr = [5,3,10];
    const Pag = mount(<Paggination  
      DBSize = { DBSize } 
      onClick = { ()=>true }
      limit = { limit }
      LimitMenuArr = { LimitMenuArr }
    />);
   
    expect(Pag.find(".btn-group button")).toHaveLength(Math.ceil( DBSize/LimitMenuArr.sort((a,b)=>a-b)[0]) );
    expect(Pag.find(".btn-group button[page="+0+"].activPagin")).toHaveLength(1);
    expect(Pag.find(".LimitMenu button[limit="+LimitMenuArr.sort((a,b)=>a-b)[0]+"].activPagin")).toHaveLength(1);  
  });

});

