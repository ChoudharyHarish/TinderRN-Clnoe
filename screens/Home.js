import {
  View,
  Text,
  Platform,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import useAuth from "../Context/useAuth";
import { FontAwesome } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";

import { useNavigation } from "@react-navigation/native";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebaseconfig";
import generateID from "../utils/generateID";

export default function Home() {
  const { user, logout } = useAuth();
  const swiperRef = useRef(null);
  const navigation = useNavigation();
  const [profiles, setProfiles] = useState([]);
  const [change,SetChanged] = useState(false);
  // const [passes, setPasses] = useState([]);
  // const [matches, setMatches] = useState([]);

  useLayoutEffect(
    () =>
      onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        if (!snapshot.exists()) {
          navigation.navigate("AccountModal");
        }
      }),
    []
  );

  useEffect(() => {
    let unsub;
    // console.log('use Effect');
    const fetchData = async () => {
      const passes = await getDocs(
        collection(db, "users", user.uid, "passes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const matches = await getDocs(
        collection(db, "users", user.uid, "matches")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

        console.log(passes);
        console.log(matches);


      const passedUserIds = passes.length > 0 ? passes : ["test"];
      const matchedUserIds = matches.length > 0 ? matches : ["test"];
      unsub = onSnapshot(
        query(
          collection(db, "users"),
          where("id", "not-in", [...passedUserIds, ...matchedUserIds])
        ),
        (snapshot) => {
          setProfiles(
            snapshot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
          );
        }
        );
      };
      fetchData();
    return unsub;
  }, [db]);

  const swipeRight = async (index) => {
    if (!profiles[index]) return;
    const swippedUser = profiles[index];

    const userProfile = (await getDoc(doc(db, "users", user.uid))).data();

    //first check if the user you swaped have already swapped you or not
    getDoc(doc(db, "users", swippedUser.id, "matches", user.uid)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          setDoc(
            doc(db, "users", user.uid, "matches", swippedUser.id),
            swippedUser
          );
          // make a match and move to modal screen''
          setDoc(doc(db,'matchedUsers',generateID(swippedUser.id,userProfile.id)),{
            users:{
              [user.uid]:userProfile,
              [swippedUser.id] : swippedUser
            },
            usersMatched:[user.uid,swippedUser.id],
            timeStamp : serverTimestamp()
          })

          navigation.navigate('Match',{userProfile,swippedUser})

        } else {
          setDoc(
            doc(db, "users", user.uid, "matches", swippedUser.id),
            swippedUser
          );
        }
      }
    );

    // SetChanged((prev) => !prev);
  };

  // console.log(profiles);

  const swipeLeft = async(index) => {
    if (!profiles[index]) return;
    const swippedUser = profiles[index];
    await setDoc(doc(db, "users", user.uid, "passes", swippedUser.id), swippedUser);
    // SetChanged((prev) => !prev);
  };

  return (
    <View
      className="relative"
      style={{
        paddingTop: Platform.OS === "android" ? 40 : 0,
        height: "100%",
      }}
    >
      <View className="flex-row items-center justify-between px-5">
        <TouchableOpacity onPress={() => logout()}>
          <Image
            source={{ uri: user.photoURL }}
            className="h-10 w-10 rounded-full"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("AccountModal")}>
          <Image
            source={require("../assets/logo2.jpeg")}
            resizeMode="contain"
            className="h-14 w-14"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <FontAwesome name="comments" size={28} color="#FF655B" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 mt-[-6]">
        <Swiper
          ref={swiperRef}
          cards={profiles}
          containerStyle={{ backgroundColor: "transparent" }}
          stackSize={5}
          cardIndex={0}

          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "MATCH",
              style: {
                label: {
                  textAlign: "left",
                  color: "green",
                },
              },
            },
          }}
          onSwipedLeft={(cardIndex) => swipeLeft(cardIndex)}
          onSwipedRight={(cardIndex) => swipeRight(cardIndex)}
          animateCardOpacity
          verticalSwipe={false}
          renderCard={(card) =>
            card ? (
              <View
                key={card.id}
                className="h-3/4 bg-white relative rounded-xl"
              >
                <Image
                  source={{ uri: card.photoURL }}
                  className="absolute top-0 h-full w-full rounded-xl"
                />
                <View className="absolute bottom-0 bg-white h-20 w-full flex-row justify-between px-6 py-3 rounded-b-xl">
                  <View className="">
                    <Text className="font-bold text-xl">
                      {card.displayName}
                    </Text>
                    <Text className="font-bold text-sm">{card.job}</Text>
                  </View>
                  <Text className="font-bold text-xl">{card.age}</Text>
                </View>
              </View>
            ) : (
              <View className="h-3/4 bg-white relative rounded-xl items-center justify-center">
                <Text className="font-bold pb-5">No More Profiles</Text>

                <Image
                  source={require("../assets/fallback.png")}
                  className="h-20 w-20 rounded-xl"
                />
              </View>
            )
          }
        />
      </View>

      <View className="flex-row justify-evenly mb-10">
        <TouchableOpacity
          onPress={() => swiperRef.current.swipeLeft()}
          className="bg-[#ffbcb8] h-14 w-14 rounded-full items-center justify-center"
        >
          <FontAwesome name="close" color="#fc6d65" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => swiperRef.current.swipeRight()}
          className="bg-[#bcffcb] h-14 w-14 rounded-full items-center justify-center"
        >
          <FontAwesome name="heart" color="rgba(14,123,38,0.8)" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    justifyContent: "center",
    backgroundColor: "white",
  },
});
