import React from 'react'
import Enzyme, { shallow, mount, render } from 'enzyme'
import Paggination from '../components/Pagination'
import renderer from 'react-test-renderer';

describe('<Paggination /> ', () => {
  it("render correctly Paggination component ", () => {
    const Pag = renderer.create(<Paggination DBSize={7} />).toJSON();
    expect(Pag).toMatchSnapshot();
  });

  it("check the type of Paggination value ", () => {
    const DBSize =100, limit = 5, page = 10;
    const Pag = mount(<Paggination  
      DBSize = { DBSize } 
      onClick = { ()=>true }
      limit = { limit }
      page = { page }
    />);
    expect(Pag.prop("DBSize")).toBe(DBSize);
    expect(Pag.prop("limit")).toBe(limit);
    expect(Pag.prop("page")).toBe(page);
    expect(Pag.find(".btn-group button")).toHaveLength(Math.ceil(DBSize/limit));
    expect(Pag.find(".btn-group button[page="+page+"].activPagin")).toHaveLength(1);
    expect(Pag.find(".LimitMenu button[limit='"+limit+"'].activPagin")).toHaveLength(1);
  });

  it("check the resize operation ", () => {
    const DBSize = 100, limit = 5, page = 10;
    const Pag = mount(<Paggination  
      DBSize = { DBSize } 
      onClick = { ()=>true }
      limit = { limit }
      page = { page }
    />);
    expect(Pag.find(".btn-group button")).toHaveLength(Math.ceil(DBSize/limit));

    Pag.find('.LimitMenu button[limit="'+3+'"]').simulate('click');
    expect(Pag.find(".btn-group button")).toHaveLength(Math.ceil(DBSize/3));

    Pag.find('.LimitMenu button[limit="'+5+'"]').simulate('click');
    expect(Pag.find(".btn-group button")).toHaveLength(Math.ceil(DBSize/5));
 
    Pag.find('.LimitMenu button[limit="'+10+'"]').simulate('click');
    expect(Pag.find(".btn-group button")).toHaveLength(Math.ceil(DBSize/10));
    
  });

});

