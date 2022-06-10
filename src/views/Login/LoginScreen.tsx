import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  useContext,
  useState,
} from "react";
import {
  BodyLogin,
  MyLogin,
  Img,
  FormLogin,
  TitleLogin,
  ContentTitle,
} from "./LoginStyle";
import logo from "../../assets/logo_club.jpg";
import { postLogin, whois } from "../../api/auth";
import { AuthContext } from "../../stateManagement/context";

interface State {
  email: string;
  password: string;
  showPassword: boolean;
}

const LoginScreen = () => {
  const { setUser } = useContext(AuthContext);
  const [values, setValues] = useState<State>({
    email: "",
    password: "",
    showPassword: false,
  });

  const handleChange =
    (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = values;
    const { data } = await postLogin(email, password);
    const { user } = data;
    const { access_token, refresh_token } = user;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    const { data: dataUser } = await whois();
    const { user: myData } = dataUser;
    setUser(myData);
    localStorage.setItem("user", JSON.stringify(dataUser));
  };

  return (
    <BodyLogin>
      <Img>
        <img src={logo} alt="Logo" />;
      </Img>
      <MyLogin>
        <FormLogin onSubmit={onSubmit}>
          <ContentTitle>
            <TitleLogin>Iniciar sesion</TitleLogin>
          </ContentTitle>
          <TextField
            onChange={handleChange("email")}
            id="email-text"
            label="Email"
            variant="outlined"
          />
          <Box sx={{ marginY: 1 }} />
          <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Contraseña
            </InputLabel>
            <OutlinedInput
              id="password-text"
              type={values.showPassword ? "text" : "password"}
              value={values.password}
              onChange={handleChange("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Contraseña"
            />
          </FormControl>
          <Box sx={{ marginY: 1 }} />
          <Button variant="contained" type="submit">
            INGRESAR
          </Button>
        </FormLogin>
      </MyLogin>
    </BodyLogin>
  );
};

export default LoginScreen;
