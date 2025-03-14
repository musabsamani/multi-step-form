import { useState, useReducer } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Registration from './components/registration';
import PlanSelection from './components/planSelection';
import AddOns from './components/addOnes';
import FinishingUp from './components/finishigUp';
import Endmsg from './components/endMsg';
import '../scss/app.scss';
import { useMyContext } from './contextProvider';
import IconArcade from "/assets/images/icon-arcade.svg"
import IconAdvanced from "/assets/images/icon-advanced.svg"
import IconPro from "/assets/images/icon-pro.svg"

const serviceReducer = (state, action) => {
  switch (action.type) {
    case 'toggleCheck':
      // Update the checked value of the specified service
      return {
        ...state,
        [action.serviceName]: {
          ...state[action.serviceName],
          checked: !state[action.serviceName].checked,
        },
      };
    default:
      return state;
  }
};
const planReducer = (planState, action) => {
  switch (action.type) {
    case 'toggleCheck':
      return {
        ...planState,
        [action.planNo]: {
          ...planState[action.planNo],
          checked: !planState[action.planNo].checked,
        }
      };
    default:
      return planState;

  }
};
function App() {

  const {planPeriod,setPlanPeriod,userInfo,currentPage, nextPage}=useMyContext()
  const schema = yup
    .object({
      name: yup.string().required('must enter a name'),
      email: yup.string().email('Please enter a valid email address').required('must enter an email address'),
      phone: yup.string().test('custom-pattern', 'Invalid phone format', (value) => {
        const customPattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return customPattern.test(value);
      }).required('must enter your phone number'),
    }).required()

  const { register, control, handleSubmit, formState: { errors, touchedFields } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: userInfo,
    mode: 'all',
  });

  const page = {
    1: ['STEP 1', 'YOUR INFO'],
    2: ['STEP 2', 'SELECT PLAN'],
    3: ['STEP 3', 'ADD-ONS'],
    4: ['STEP 4', 'SUMMARY']
  }
  
  const [style, setStyle] = useState({ justifyContent: 'flex-start' })
  const [selectedPlan, setSelectedPlan] = useState([])
  const [selectedOption, setSelectedOption] = useState([])
  const formData = {
    step2: { selectedPlan },
    step3: { selectedOption },
  };

  
  const pp = (planPeriod === 'monthly') ? 'mo' : 'yr';
  const plan = {
    plan1: {
      planName: "Acrade",
      monthly: 9,
      yearly:90,
      img: IconArcade,
      pp:4
    },
    plan2: {
      planName: "Advanced",
      monthly: 12,
      yearly:120,      //:[12,120],
      img: IconAdvanced 
    },
    plan3: {
      planName: "Pro",
      monthly: 15,
      yearly:150,    //: [15,150],
      img: IconPro 
    }
  }
  const services = {
    service1: {
      name: 'Online Service',
      description: 'Access to multiplayer games',
      price: planPeriod === 'monthly' ? 1 : 10,
      checked: false
    },
    service2: {
      name: 'Larger Storage',
      description: 'Extra 1TB of cloud save',
      price: planPeriod === 'monthly' ? 2 : 20,
      checked: false
    },
    service3: {
      name: 'Customizable Profile',
      description: 'Custom theme on your profile',
      price: planPeriod === 'monthly' ? 2 : 20,
      checked: false
    },
  }
  const [state, dispatch] = useReducer(serviceReducer, services)
  const [planState, planDispatch] = useReducer(planReducer, plan)
  // #####################################################################
  const styleOfGoBack = currentPage === 1 ? { visibility: 'hidden' } : { visibility: 'visible' };
  const handleGoBack = () => { { (currentPage === 1) ? '' : nextPage(currentPage - 1) } };
  const handleGoNext = () => { (currentPage === 4) ? '' : nextPage(currentPage + 1) }
  const forbedden = () => console.log('forbeden')
  const disabling = (Object.keys(errors).length > 0) ? true : false
  // #####################################################################



  const handlePlan = (planName, price, planNo) => {

    const plan = {
      planName: planName,
      price: price
    }
    console.log(planName, price, planNo)
    planDispatch({ type: 'toggleCheck', planNo })
    setSelectedPlan(plan)
  }
  const handleClick=(style)=> {
    if (style.justifyContent === 'flex-start') {
      setStyle(style = { justifyContent: 'flex-end' })
      setPlanPeriod('yearly')
    } else {
      setStyle(style = { justifyContent: 'flex-start' })
      setPlanPeriod('monthly')
    }
  }

  const handleOnChange = (option, price, serviceName) => {
    const OptionName = (e) => e.name === option;
    const isOptionSelected = selectedOption.some(OptionName)
    const updateOption = isOptionSelected
      ? selectedOption.filter((selectedOp) => selectedOp.name !== option)
      : [...selectedOption, { name: option, price: price }];
    setSelectedOption(updateOption);
    dispatch({ type: 'toggleCheck', serviceName });
  }
  const summation = () => {
    const totalPrice = selectedOption.map(item => item.price).reduce((acc, price) => acc + price, selectedPlan.price)
    return totalPrice
  }
  const onSubmit = (data) => {
    const submittedData = { ...formData, data }
    console.log('submmition success')
    nextPage(currentPage + 1)
    console.log(submittedData)
  }

  return (
    <>
      <div className="page">
        
          <div className='steps'>
            {Object.entries(page).map(([number,info]) => (
              <div key={number} className='step_container'>
                <div className={(currentPage == number) ? 'step active' : 'step'} >{number}</div>
                <div className='stepInfo'><p>{info[0]}</p>{info[1]}</div>
              </div>
            ))}
          </div>

        {/* start form   ########################################################################*/}
        <form onSubmit={handleSubmit(onSubmit)}>
          {currentPage === 1 && <Registration forbedden={forbedden} touchedFields={touchedFields} handleGoBack={handleGoBack} handleGoNext={handleGoNext} styleOfGoBack={styleOfGoBack} UserInfo={userInfo} register={register} errors={errors} />}
          {currentPage === 2 && <PlanSelection selectedPlan={selectedPlan} handleGoBack={handleGoBack} handleGoNext={handleGoNext} styleOfGoBack={styleOfGoBack} Style={style} HandleClick={handleClick} PP={pp} Plan={planState} HandlePlan={handlePlan} />}
          {currentPage === 3 && <AddOns forbedden={forbedden} disabling={disabling} handleGoBack={handleGoBack} handleGoNext={handleGoNext} styleOfGoBack={styleOfGoBack} Services={services} PP={pp} State={state} SelectedOption={selectedOption} HChange={handleOnChange} formData={formData.step3} PlanPeriod={planPeriod} />}
          {currentPage === 4 && <FinishingUp forbedden={forbedden} disabling={disabling} handleGoBack={handleGoBack} handleGoNext={handleGoNext} styleOfGoBack={styleOfGoBack} TP={summation()} PP={pp} formData={formData.step4} SelectedPlan={selectedPlan} PlanPeriod={planPeriod} SelectedOption={selectedOption} NextPage={nextPage} />}
          {currentPage === 5 && <Endmsg />}
        </form>
      </div>
    {/* <DevTool control={control} /> */}
    </>
  )
}
export default App
