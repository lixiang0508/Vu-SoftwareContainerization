import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MainPage from './container/MainPage';
import EditPage from './container/EditPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/edit/:id",
    element: <EditPage />,
  },
]);


function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
