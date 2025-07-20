import crypto from "crypto"

interface SMSConfig {
  username: string
  password: string
  baseUrl: string
}

interface SMSResponse {
  success: boolean
  message: string
  data?: any
}

interface LoginResponse {
  accesskey: string
  csrftoken: string
}

class SMSService {
  private config: SMSConfig

  constructor() {
    this.config = {
      username: process.env.SMS_API_USERNAME || "",
      password: process.env.SMS_API_PASSWORD || "",
      baseUrl: "https://gpcmp.grameenphone.com",
    }
  }

  private generateTimestamp(): string {
    const timestamp = Math.floor(Date.now() / 1000)
    const random = Math.floor(Math.random() * (999 - 111 + 1)) + 111
    return `${timestamp}${random}`
  }

  private generateToken(timestamp: string, stateName: string): string {
    try {
      let token = ""
      for (let i = 0; i < timestamp.length; i += 2) {
        token += timestamp[i]
      }
      return stateName + timestamp + token
    } catch (error) {
      return stateName + timestamp
    }
  }

  private generateRequestToken(data: string, timestamp: string, stateName: string): string {
    const token = this.generateToken(timestamp, stateName)
    return crypto
      .createHash("sha512")
      .update(data + token)
      .digest("hex")
  }

  private async makeRequest(
    url: string,
    data?: any,
    headers: Record<string, string> = {},
    includeHeaders = false,
  ): Promise<any> {
    const options: RequestInit = {
      method: data ? "POST" : "GET",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    }

    if (data) {
      options.body = typeof data === "string" ? data : JSON.stringify(data)
    }

    try {
      const response = await fetch(url, options)
      const responseData = await response.text()

      return {
        ok: response.status,
        body: responseData,
        headers: includeHeaders ? response.headers : {},
      }
    } catch (error) {
      console.error("Request failed:", error)
      return {
        ok: 0,
        body: "",
        headers: {},
      }
    }
  }

  private async login(): Promise<LoginResponse | null> {
    const stateName = "login"
    const timestamp = this.generateTimestamp()
    const url = `${this.config.baseUrl}/cmapi/values/login`

    const loginData = {
      loginid: this.config.username,
      encryptkey: Buffer.from(this.config.password).toString("base64"),
    }

    const dataString = JSON.stringify(loginData)
    const requestToken = this.generateRequestToken(dataString, timestamp, stateName)

    const headers = {
      current: timestamp,
      reqtoken: requestToken,
      accesskey: "NA",
      csrftoken: "NA",
      statename: stateName,
      host: "gpcmp.grameenphone.com",
      origin: "https://gpcmp.grameenphone.com",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    }

    const response = await this.makeRequest(url, dataString, headers)

    if (response.ok === 200) {
      try {
        const result = JSON.parse(response.body)
        if (result.status === "success" && result.data?.accesskey && result.data?.csrftoken) {
          return {
            accesskey: result.data.accesskey,
            csrftoken: result.data.csrftoken,
          }
        }
      } catch (error) {
        console.error("Failed to parse login response:", error)
      }
    }

    return null
  }

  private async createCampaign(credentials: LoginResponse, phoneNumber: string, message: string): Promise<boolean> {
    const timestamp = this.generateTimestamp()
    const stateName = "createcampaign"
    const url = `${this.config.baseUrl}/cmapi/campaign/create`

    const now = new Date()
    const campaignData = {
      corporateid: "0",
      corpuserid: "",
      name: "",
      cli: "",
      cmptype: "4",
      status: "1",
      smstmpltype: "1",
      smstype: "2",
      smsmsg: message,
      enableheader: "0",
      headertext: "",
      enablefooter: "0",
      footertext: "",
      recipienttype: "1",
      recipientcountry: "",
      recipientlisttype: "0",
      addrbooks: [],
      tgfilecode: "",
      saveasgroup: "0",
      tgaddrname: "",
      validbasecount: "",
      scheduletype: "1",
      cmpstartdate: now.toISOString().split("T")[0].replace(/-/g, "/"),
      cmpstarthour: now.getHours().toString(),
      cmpstartminute: (now.getMinutes() + 15).toString(),
      recurringtype: "1",
      recurringvalue: "",
      recurringenddate: now.toISOString().split("T")[0].replace(/-/g, "/"),
      allowresume: "0",
      terminationtype: "2",
      terminationvalue: "",
      terminationenddate: now.toISOString().split("T")[0].replace(/-/g, "/"),
      msisdntype: "1",
      msisdn: phoneNumber,
      ftpfiles: [],
      clitype: "0",
      allowduplicate: "1",
      homedivision: [],
      homedistrict: [],
      homethana: [],
      homeward: [],
      homearea: [],
      workdivision: [],
      workdistrict: [],
      workthana: [],
      workward: [],
      workarea: [],
      minage: "0",
      maxage: "0",
      gender: [],
      productclass: [],
      financialclass: [],
      occupation: [],
      voiceusage: [],
      datausage: [],
      ostype: [],
      devbrand: [],
      devtype: [],
      tbfilters: [],
      targetbase: "1",
      targetbaselimit: "0",
      istargetbasevalidated: "0",
      validtargetbase: 0,
      smstmplid: "0",
      manualmsisdns: "",
      saveasaddrbook: "0",
      addrbookname: "",
    }

    const dataString = JSON.stringify(campaignData)
    const requestToken = this.generateRequestToken(dataString, timestamp, stateName)

    const headers = {
      current: timestamp,
      reqtoken: requestToken,
      statename: stateName,
      accesskey: credentials.accesskey,
      csrftoken: credentials.csrftoken,
      host: "gpcmp.grameenphone.com",
      origin: "https://gpcmp.grameenphone.com",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    }

    const response = await this.makeRequest(url, dataString, headers)

    if (response.ok === 200) {
      try {
        const result = JSON.parse(response.body)
        return result.status === "success"
      } catch (error) {
        console.error("Failed to parse campaign response:", error)
      }
    }

    return false
  }

  async sendSMS(phoneNumber: string, message: string): Promise<SMSResponse> {
    try {
      // Validate inputs
      if (!phoneNumber || !message) {
        return {
          success: false,
          message: "Phone number and message are required",
        }
      }

      // Validate phone number format (basic validation)
      const phoneRegex = /^(\+88)?01[3-9]\d{8}$/
      if (!phoneRegex.test(phoneNumber)) {
        return {
          success: false,
          message: "Invalid phone number format",
        }
      }

      // Check message length
      if (message.length > 160) {
        return {
          success: false,
          message: "Message too long (max 160 characters)",
        }
      }

      // Login to get credentials
      const credentials = await this.login()
      if (!credentials) {
        return {
          success: false,
          message: "Authentication failed",
        }
      }

      // Create and send campaign
      const success = await this.createCampaign(credentials, phoneNumber, message)

      if (success) {
        return {
          success: true,
          message: "SMS sent successfully",
          data: {
            phone: phoneNumber,
            message: message,
            timestamp: new Date().toISOString(),
          },
        }
      } else {
        return {
          success: false,
          message: "Failed to send SMS",
        }
      }
    } catch (error) {
      console.error("SMS Service Error:", error)
      return {
        success: false,
        message: "Internal server error",
      }
    }
  }
}

export default SMSService
export { SMSService } // named, in case it’s imported with braces
