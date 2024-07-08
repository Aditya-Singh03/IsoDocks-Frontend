import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import { FieldType, LoginProps } from "./types";
import "./login.css";
import Logo from "./images/logo.png";
import { checkLoginCredentials } from "./service";

const Login: React.FC<LoginProps> = ({ setLoggedIn }) => {
  const [isForgetForm, setIsForgetForm] = useState(false);
  const [form] = Form.useForm();
  const [forgetForm] = Form.useForm();

  const onLogin = async () => {
    try {
      await form.validateFields();
    } catch {
      return message.error("Invalid input(s). Please try again.", 3);
    }
    const res = form.getFieldsValue();
    if (isForgetForm) {
      message.info("Forget password logic is not implemented");
    } else {
      checkLoginCredentials(res)
        .then(() => setLoggedIn(true))
        .catch(() => message.error("Login error. Please try again.", 3));
    }
  };

  const sendReset = async () => {
    try {
      await forgetForm.validateFields();
    } catch {
      return message.error("Invalid username. Please try again.", 3);
    }
    message.info("Sending reset emails is not implemented");
  };

  return (
    <div className="login-container">
      <Form form={form} className="form" autoComplete="off">
        <div className="box">
          <img src={Logo} alt="logo" width={250} height={150} />
          {!isForgetForm ? (
            <>
              <Form.Item<FieldType>
                name="username"
                rules={[{ required: true, message: "Username required" }]}
                className="form-field"
              >
                <Input placeholder="Username" />
              </Form.Item>

              <Form.Item<FieldType>
                name="password"
                rules={[{ required: true, message: "Password required" }]}
                className="form-field"
              >
                <Input.Password placeholder="Password" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={onLogin}
                  className="sign-in-button"
                >
                  Sign In
                </Button>
              </Form.Item>
              <Button
                type="link"
                htmlType="button"
                onClick={() => setIsForgetForm(true)}
              >
                Forgot Password?
              </Button>
            </>
          ) : (
            <Form form={forgetForm} autoComplete="off">
              <Form.Item<FieldType>
                name="username"
                rules={[{ required: true, message: "Username required" }]}
                className="form-field"
              >
                <Input placeholder="Username" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  onClick={sendReset}
                  className="reset-button"
                >
                  Send Reset Email
                </Button>
              </Form.Item>
              <Button
                type="link"
                htmlType="button"
                onClick={() => setIsForgetForm(false)}
              >
                Back to Login
              </Button>
            </Form>
          )}
        </div>
      </Form>
    </div>
  );
};

export default Login;
