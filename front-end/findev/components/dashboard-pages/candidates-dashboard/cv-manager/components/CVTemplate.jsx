import React from 'react';
import { Page, Document, StyleSheet, View, Text, Image, Font} from '@react-pdf/renderer';

const CVTemplate = ({ profile }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerSection}>
          <View style={styles.avatarColumn}>
            <View style={styles.avatar}>
              <Image src={profile?.avatar} alt="" />
            </View>
          </View>
          <View style={styles.infoWrapColumn}>
            <View style={styles.name}>
              <Text>{profile?.full_name}</Text>
            </View>
            <View style={styles.position}>
              <Text>{profile?.good_at_position}</Text>
            </View>
            <View style={styles.aboutMe}>
              <Text>{profile?.about_me}</Text>
            </View>
          </View>
        </View>

        <View className="body-section">
          <View className="left-section">
            <View className="contact">
              <View className="title">
                <Text>CONTACT</Text>
              </View>
              <View className="contact-content">
                <View className="contact-item">
                  <View className="icon">
                    <i className="la la-calendar"></i>
                  </View>
                  <View className="text">
                    {profile?.date_of_birth}
                  </View>

                  <View className="icon">
                    <i className="la la-phone"></i>
                  </View>
                  <View className="text">
                    {profile?.phone}
                  </View>

                  <View className="icon">
                    <i className="la la-home"></i>
                  </View>
                  <View className="text">
                    {profile?.address}
                  </View>

                  <View className="icon">
                    <i className="la la-envelope"></i>
                  </View>
                  <View className="text">
                    {profile?.email}
                  </View>
                </View>
              </View>
            </View>

            <View className="education">
              <View className="title">
                EDUCATION
              </View>
              <View className="content">
                <View className="item">
                  <View className="time">
                    2015 - 2019 (Fixed)
                  </View>
                  <View className="sub-title">
                    {profile?.education?.university}
                  </View>
                  <View className="sub-title2">
                    {profile?.education?.major}
                  </View>
                  <View className="text">
                    {profile?.education?.description}
                  </View>
                </View>
              </View>
            </View>

            <View className="skills">
              <View className="title">
                SKILLS
              </View>
              <View className="content">
                <ul>
                  {profile?.skills.map((skill) => (
                    <li key={skill.id}>
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </View>
            </View>
          </View>

          <View className="right-section">
            <View className="experience">
              <View className="title">
                EXPERIENCE
              </View>
              <View className="content">
                {profile?.experiences.map((exp) => (
                  <View className="item" key={exp.id}>
                    <View className="time">
                      {exp.start} - {exp.end}
                    </View>
                    <View className="sub-title">
                      {exp?.position}
                    </View>
                    <View className="sub-title2">
                      {exp?.title}
                    </View>
                    <View className="text">
                      {exp?.description}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
Font.register({
    family: 'Roboto',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
  });
// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    padding: 20,
    fontFamily: 'Roboto',
  },
  headerSection: {
    flexDirection: 'row',
    width: '100%',
    height: 200,
    padding: 20,
    // borderBottom: '1px solid #ccc',
  },
  avatarColumn: {
    width: 120,
    marginRight: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    overflow: 'hidden',
  },
  infoWrapColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  name: {
    fontSize: 32,
    fontWeight: 700,    
    marginBottom: 10,
    color: '#2971cf',
  },
  position: {
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 10,
    textTransform: 'uppercase',
    color: 'green',
  },
  aboutMe: {
    fontSize: 16,
    fontWeight: 400,
    marginBottom: 10,
  },
    bodySection: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    padding: 20,
    },
    title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 10,
    textTransform: 'uppercase',
    },
    subtitle: {
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 10,
    },
    subtitle2: {
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 10,
    fontStyle: 'bold',
    },
});

export default CVTemplate;
