import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './routes/LandingPage';
import { PlanTrip } from './routes/PlanTrip';
import { ManagePics } from './routes/ManagePics';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/plan-trip' element={<PlanTrip />} />
        <Route path='/manage-pics' element={<ManagePics />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;