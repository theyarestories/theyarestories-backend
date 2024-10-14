export default function resetPasswordEmailHtml(resetUrl: string) {
  return `
  <div style="background-color: #BBF7D0; padding: 32px; font-family: sans-serif;">
    <!--  Container  -->
    <div style="background-color: white; max-width: 320px; margin: auto; padding: 10px; border: 1px solid #ddd; border-radius: 5px">
      <!--  Header  -->
      <div style="border-bottom: 1px solid #ddd">
        <img src="https://res.cloudinary.com/dfddvb63i/image/upload/v1707351176/logo_a1ewr8.png" alt="Logo" style="width: 40px; hight: auto" />
      </div>
  
      <!--   Body   -->
      <div style="padding-top: 10px; padding-bottom: 10px">
        <!--   Reset button   -->
        <a href="${resetUrl}" style="text-decoration: none; font-weight: 600; color: white; background-color: #166534; padding: 10px; display: inline-block; border-radius: 2px; font-size: 14px;">Reset your password</a>
      </div>
    </div>
  </div>
  `;
}
