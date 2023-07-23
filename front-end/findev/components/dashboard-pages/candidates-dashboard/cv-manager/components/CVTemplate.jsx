import { Page, Document, StyleSheet, View, Text, Image, Font, Svg } from '@react-pdf/renderer';
import { useEffect, useState, React} from 'react';

const CVTemplate = ({ profile, avatar }) => {
  // console.log(avatar);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (profile) {
      setLoading(!loading);
    }
  }, [profile]);

  if (loading === false) {
    // console.log(profile);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
      <View style={styles.top}>
        <View style={styles.imgBox}>
        {/* <Image src="/eakan.jpeg" style={styles.img} /> */}
          <Image
            src={ profile?.avatar }
            style={styles.img}
            // source={{
            //   header: {
            //     'Access-Control-Allow-Origin': '*'
            //   }
            // }}
          />
          {/* <Image src={{ uri: profile?.avatar,
          method: 'GET', 
          headers: {"Content-Type": "application/json",
                    "Accept":"application/json"}, 
          body: '',
          mode:'no-cors' }} 
          style={styles.img} /> */}
        </View>
        <View style={styles.topBox}>
          <Text style={styles.name}>{profile?.full_name}</Text>
          <Text style={styles.position}>{profile?.good_at_position}</Text>
          <Text style={styles.text}>{profile?.about_me}</Text>
        </View>
      </View>


        <View style={styles.body}>
          <View style={styles.left}>
            <View style={styles.box}>
              <Text style={styles.title}>LIÊN HỆ</Text>
              <Text style={styles.text}>Email: {profile?.email}</Text>
              <Text style={styles.text}>SĐT: {profile?.phone}</Text>
              <Text style={styles.text}>Địa chỉ: {profile?.address}</Text>
              <Text style={styles.text}>Ngày sinh: {profile?.date_of_birth && new Date(profile.date_of_birth).toLocaleDateString('en-GB')}</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.title}>HỌC VẤN</Text>
              {profile?.educations.map((edu, index) => (
                <View key={index}>
                  <Text style={styles.time}>{edu.start} - {edu.end}</Text>
                  <Text style={styles.subtitle}>{edu.university.toLowerCase()}</Text>
                  <Text style={styles.additional_text}>{edu.major}</Text>
                </View>
              ))}
            </View>
            <View style={styles.box}>
              {profile?.skills.length > 0 ? (
                <>
                <Text style={styles.title}>KĨ NĂNG</Text>
                {profile?.skills.map((skill, index) => (
                  <Text style={styles.text} key={index}>• {skill.skill}</Text>
                ))}
                </>
              ):null}
            </View>
            <View style={styles.boxLast}>
            {profile?.achievements.length > 0 ? (
              <>
                <Text style={styles.title}>THÀNH TỰU</Text>
                {profile?.achievements.map((ach, index) => (
                  <View key={index}>
                    <Text style={styles.text}>• {ach.description}</Text>
                  </View>
                ))}
              </>
            ) : null}
          </View>
          </View>
          <View style={styles.right}>
          <View style={styles.boxLast}>
              {profile?.experiences.length > 0 ? (
                <>
                  <Text style={styles.title}>KINH NGHIỆM LÀM VIỆC</Text>
                  {profile?.experiences.map((exp, index) => (
                    <View key={index}>
                      <Text style={styles.time}>
                        {exp?.start && new Date(exp.start).toLocaleDateString('en-GB')} -{' '}
                        {exp.end && new Date(exp.end).toLocaleDateString('en-GB')}
                      </Text>
                      <Text style={styles.subtitle}>{exp.position}</Text>
                      <Text style={styles.text}>• {exp.title}</Text>
                      <Text style={styles.text}>{exp.description}</Text>
                    </View>
                  ))}
                </>
              ) : null}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
  }
  return (
    <a>Loading...</a>
  );
};

Font.register({
  family: 'Roboto Light',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
});
Font.register({
  family: 'Roboto Medium',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
});
Font.register({
  family: 'Roboto Bold',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
});
Font.register({
  family: 'Roboto Italic',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf',
});
// Create styles
const styles = StyleSheet.create({
  page: {
    display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: 20,
    fontFamily: 'Roboto',
  },
  top: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#112131',
    borderBottomStyle: 'solid',
    alignItems: 'stretch',
    paddingBottom: 20,
  },
  topBox: {
    flex: 1, // Take up all available space
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 20,
    paddingBottom: 20,
  },
  imgBox: {
    width: 200,
    height: 200,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: 0.5,
    borderRadius: '50%',
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    // textTransform: 'uppercase',
    fontFamily: 'Roboto Bold',
  },
  position: {
    fontSize: 16,
    // fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#12b012',
    fontFamily: 'Roboto Bold',
  },
  title: {
    paddingTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#12b012',
    fontFamily: 'Roboto Bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  additional_text: {
    fontSize: 12,
    textTransform: 'capitalize',
    marginBottom: 10,
  },
  textLower: {
    fontSize: 12,
    textTransform: 'lowercase',
    marginBottom: 10,
  },
  textCap: {
    fontSize: 12,
    textTransform: 'capitalize',
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  textUpper: {
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  textBold: {
    fontSize: 12,
    // fontWeight: 'bold',
    fontFamily: 'Roboto Bold',
  },
  time: {
    fontSize: 12,
    fontFamily: 'Roboto Italic',
    marginBottom: 5,
    marginTop: 5,
    // fontStyle: 'italic',
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  left: {
    flexDirection: 'column',
    width: '50%',
    paddingRight: 15,
    borderRightWidth: 1,
    borderRightColor: '#112131',
    borderRightStyle: 'solid',
  },
  right: {
    flexDirection: 'column',
    width: '50%',
    paddingRight: 15,
    marginLeft: 15,
  },
  box: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#112131',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
  },
  boxLast: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});

export default CVTemplate;
